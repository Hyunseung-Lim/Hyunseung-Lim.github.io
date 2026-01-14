import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './Crafteam.css';
import { useTheme } from '../../../contexts/ThemeContext';

const ROLE_LIBRARY = ['Idea Generation', 'Idea Evaluation', 'Feedback', 'Request'];

const AGENT_BLUEPRINTS = [
  {
    id: 'A',
    label: 'Member A',
    archetype: 'Vision Synthesizer',
    description: 'Turns rough sketches into provocative prompts by sampling research signals.',
    collaborationStyle: 'Divergent catalyst',
    energy: 0.85,
    defaultRoles: ['Idea Generation', 'Feedback']
  },
  {
    id: 'B',
    label: 'Member B',
    archetype: 'Systems Cartographer',
    description: 'Surfaces constraints, metrics, and policy angles before choices are locked in.',
    collaborationStyle: 'Evidence-first',
    energy: 0.7,
    defaultRoles: ['Idea Evaluation', 'Request']
  },
  {
    id: 'C',
    label: 'Member C',
    archetype: 'Narrative Coach',
    description: 'Keeps story arcs cohesive and translates critiques into motivating reframes.',
    collaborationStyle: 'Empathic mirror',
    energy: 0.65,
    defaultRoles: ['Feedback', 'Idea Generation']
  },
  {
    id: 'D',
    label: 'Member D',
    archetype: 'Ops Conductor',
    description: 'Tracks dependencies, assigns follow-ups, and protects focus time.',
    collaborationStyle: 'Structured pragmatist',
    energy: 0.6,
    defaultRoles: ['Request', 'Idea Evaluation']
  }
];

const HUMAN_FACILITATOR = {
  id: 'Me',
  label: 'You',
  archetype: 'Human facilitator',
  description: 'Holds the creative intent and negotiates with stakeholders.',
  collaborationStyle: 'Adaptive anchor',
  energy: 1,
  defaultRoles: ['Idea Generation', 'Idea Evaluation']
};

const STEPS = [
  { id: 'size', label: 'Basic Team Information', description: 'Set team details.' },
  { id: 'structure', label: 'Structure', description: 'Decide how members stay connected.' },
  { id: 'roles', label: 'Roles', description: 'Distribute cognitive work.' },
  { id: 'member-composition', label: 'Member Composition', description: 'Create or import AI.' },
  { id: 'shared-model', label: 'Shared Mental Model', description: 'Align on values & rituals.' }
];
const ROLE_STEP_INDEX = STEPS.findIndex((step) => step.id === 'roles');
const MEMBER_COMPOSITION_STEP_INDEX = STEPS.findIndex(
  (step) => step.id === 'member-composition'
);

const TEAM_COMPOSITION_OPTIONS = [
  {
    id: 'size-3',
    totalMembers: 3,
    label: 'A total of 3 members',
    description: 'Me + 2 AI team members'
  },
  {
    id: 'size-4',
    totalMembers: 4,
    label: 'A total of 4 members',
    description: 'Me + 3 AI team members'
  },
  {
    id: 'size-5',
    totalMembers: 5,
    label: 'A total of 5 members',
    description: 'Me + 4 AI team members'
  },
  {
    id: 'size-6',
    totalMembers: 6,
    label: 'A total of 6 members',
    description: 'Me + 5 AI team members'
  }
];

const CANVAS_VIEWBOX = { width: 800, height: 420 };
const CANVAS_PADDING = 60;
const NODE_OUTER_RADIUS = 32;
const NODE_INNER_RADIUS = 26;
const TOGGLE_ICON = `${process.env.PUBLIC_URL}/projects/crafteam/togglebtn.svg`;

const RELATIONSHIP_TYPES = {
  PEER: {
    id: 'PEER',
    label: 'Peer',
    color: '#2b7fff',
    strokeWidth: 2,
    dasharray: '6 6',
    markerId: null
  },
  SUPERIOR: {
    id: 'SUPERIOR',
    label: 'Superior–Subordinate',
    color: '#4c506a',
    strokeWidth: 2.4,
    dasharray: null,
    markerId: 'crafteam-arrow-superior'
  }
};

const RELATIONSHIP_TYPE_LIST = Object.values(RELATIONSHIP_TYPES);

const DEFAULT_SKILL_OPTIONS = [
  'Creative Planning',
  'Brainstorming',
  'Problem Solving & Analysis',
  'Design Thinking',
  'Strategy & Planning',
  'Concept Design',
  'Content Storytelling',
  'Visualization & Infographics',
  'Project Management',
  'Data Analysis',
  'UI/UX Design',
  'User Research',
  'Prototyping',
  'Team Leadership',
  'Communication',
  'Presentation'
];

const GENDER_OPTIONS = ['Female', 'Male', 'Non-binary', 'Prefer not to say'];
const EDUCATION_OPTIONS = [
  "Bachelor's Degree",
  "Master's Degree",
  'PhD',
  'Professional Program',
  'Self-taught'
];

const EXISTING_AGENT_LIBRARY = [
  {
    id: 'agent-vicky',
    name: 'Vicky Han',
    age: '28',
    gender: 'Female',
    education: "Master's Degree",
    occupation: 'UX Researcher',
    skills: ['User Research', 'Communication', 'Design Thinking'],
    personality: 'Empathic listener with a structured thinking style.',
    behavior: 'Documents insights diligently and nudges teammates to test assumptions.',
    likes: 'Ethnography notes, thoughtful interviews, evidence-driven workshops.',
    dislikes: 'Rushing decisions without data.'
  },
  {
    id: 'agent-marcus',
    name: 'Marcus Lee',
    age: '32',
    gender: 'Male',
    education: "Bachelor's Degree",
    occupation: 'Product Strategist',
    skills: ['Strategy & Planning', 'Concept Design', 'Presentation'],
    personality: 'Confident storyteller who links market shifts with product vision.',
    behavior: 'Runs synthesis huddles and reframes vague goals into measurable bets.',
    likes: 'Competitive analysis decks, crisp narratives, measurable KPIs.',
    dislikes: 'Unbounded scopes and unclear ownership.'
  },
  {
    id: 'agent-sena',
    name: 'Sena Park',
    age: '26',
    gender: 'Non-binary',
    education: 'Professional Program',
    occupation: 'Creative Technologist',
    skills: ['Prototyping', 'Data Analysis', 'Visualization & Infographics'],
    personality: 'Playful prototyper who translates ideas into tangible proofs fast.',
    behavior: 'Builds scrappy demos, shares Loom walkthroughs, and invites critique early.',
    likes: 'Figma-to-Web experiments, sensor datasets, whimsical micro-interactions.',
    dislikes: 'Never-ending planning conversations.'
  }
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const computeDefaultNodePositions = (members) => {
  if (!members.length) {
    return {};
  }
  const centerX = CANVAS_VIEWBOX.width / 2;
  const centerY = CANVAS_VIEWBOX.height / 2;
  const radius = Math.min(CANVAS_VIEWBOX.width, CANVAS_VIEWBOX.height) / 2 - CANVAS_PADDING;
  const angleStep = (2 * Math.PI) / members.length;
  return members.reduce((acc, member, index) => {
    const angle = angleStep * index - Math.PI / 2;
    acc[member.id] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
    return acc;
  }, {});
};

const normalizeMemberLabel = (label, id) => {
  if (label && !/^Agent\b/i.test(label)) {
    return label;
  }
  return `Member ${id}`;
};

const createEmptyMemberProfile = () => ({
  mode: 'create',
  name: '',
  age: '',
  gender: '',
  education: '',
  occupation: '',
  skills: [],
  personality: '',
  behavior: '',
  likes: '',
  dislikes: '',
  customSkill: '',
  agentId: null,
  isConfigured: false
});

const buildMemberProfiles = (memberList, previousProfiles = {}) => {
  const nextProfiles = {};
  memberList.forEach((member) => {
    if (previousProfiles[member.id]) {
      nextProfiles[member.id] = previousProfiles[member.id];
      return;
    }
    if (member.id === 'Me') {
      nextProfiles[member.id] = {
        ...createEmptyMemberProfile(),
        name: 'Me',
        mode: 'create',
        isConfigured: true
      };
      return;
    }
    nextProfiles[member.id] = createEmptyMemberProfile();
  });
  return nextProfiles;
};

const createMemberRoster = (size, previousMembers = []) => {
  const desiredSize = clamp(size, 3, 6);
  const aiSlots = desiredSize - 1;
  const previousMap = new Map(previousMembers.map((member) => [member.id, member]));

  const buildMember = (blueprint) => {
    const existing = previousMap.get(blueprint.id);
    const label = normalizeMemberLabel(existing?.label ?? blueprint.label, blueprint.id);
    if (!existing) {
      return {
        ...blueprint,
        label,
        roles: [],
        focus: blueprint.collaborationStyle
      };
    }
    return {
      ...blueprint,
      ...existing,
      label,
      roles: Array.isArray(existing.roles) ? existing.roles : [],
      focus: existing.focus || blueprint.collaborationStyle
    };
  };

  const newRoster = [
    {
      ...buildMember(HUMAN_FACILITATOR),
      roles: []
    }
  ];

  for (let index = 0; index < aiSlots; index += 1) {
    const blueprint = AGENT_BLUEPRINTS[index] || {
      id: String.fromCharCode(65 + index),
      label: `Member ${String.fromCharCode(65 + index)}`,
      archetype: 'Generalist Collaborator',
      description: 'Adapts to fill gaps in the workflow.',
      collaborationStyle: 'Flexible',
      energy: 0.65,
      defaultRoles: ROLE_LIBRARY.slice(0, 2)
    };
    newRoster.push(buildMember(blueprint));
  }

  return newRoster;
};

export const CrafteamUI = ({ fadeRef }) => {
  const { isDark } = useTheme();
  const [hasStarted, setHasStarted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [teamSize, setTeamSize] = useState(0);
  const [pendingTeamSize, setPendingTeamSize] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [topic, setTopic] = useState('');
  const [members, setMembers] = useState([]);
  const [sharedMentalModel, setSharedMentalModel] = useState('');
  const [relationships, setRelationships] = useState([]);
  const [nodePositions, setNodePositions] = useState({});
  const [initialPlacementReady, setInitialPlacementReady] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [mousePosition, setMousePosition] = useState(null);
  const [draggedNode, setDraggedNode] = useState(null);
  const [selectedRelationshipType, setSelectedRelationshipType] = useState(RELATIONSHIP_TYPES.PEER.id);
  const [relationshipPreviewOpen, setRelationshipPreviewOpen] = useState(false);
  const [roleRelationshipPreviewOpen, setRoleRelationshipPreviewOpen] = useState(false);
  const [memberProfiles, setMemberProfiles] = useState(() => buildMemberProfiles(members));
  const [activeMemberIndex, setActiveMemberIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const svgRef = useRef(null);
  const toggleIconStyle = useMemo(
    () => ({
      WebkitMask: `url(${TOGGLE_ICON}) center / contain no-repeat`,
      mask: `url(${TOGGLE_ICON}) center / contain no-repeat`
    }),
    []
  );

  const handleTeamSizeCommit = () => {
    if (!pendingTeamSize) {
      return;
    }
    setTeamSize(pendingTeamSize);
    setMembers((prevMembers) => createMemberRoster(pendingTeamSize, prevMembers));
    setNodePositions({});
    setInitialPlacementReady(true);
  };

  const activeMembers = useMemo(() => (teamSize ? members.slice(0, teamSize) : []), [members, teamSize]);
  const orderedMembers = members;
  const previewMembers = useMemo(() => {
    if (teamSize) {
      return activeMembers;
    }
    if (pendingTeamSize) {
      return createMemberRoster(pendingTeamSize, members);
    }
    return [];
  }, [activeMembers, teamSize, pendingTeamSize, members]);

  useEffect(() => {
    setMemberProfiles((prev) => buildMemberProfiles(members, prev));
    setActiveMemberIndex((prev) => {
      if (!members.length) {
        return 0;
      }
      return Math.min(prev, members.length - 1);
    });
  }, [members]);

  useEffect(() => {
    if (teamSize && pendingTeamSize === null) {
      setPendingTeamSize(teamSize);
    }
  }, [teamSize, pendingTeamSize]);

  const currentMember = orderedMembers[activeMemberIndex] || null;
  const currentProfile = currentMember ? memberProfiles[currentMember.id] : undefined;
  const isAgentInUse = useCallback(
    (agentId, requestingMemberId) =>
      orderedMembers.some(
        (member) => member.id !== requestingMemberId && memberProfiles[member.id]?.agentId === agentId
      ),
    [memberProfiles, orderedMembers]
  );
  const hasIdeaGenerationRole = useMemo(
    () => members.some((member) => member.roles.includes('Idea Generation')),
    [members]
  );
  const everyMemberHasRole = useMemo(
    () => activeMembers.every((member) => member.roles.length > 0),
    [activeMembers]
  );
  const hasTeamName = useMemo(() => teamName.trim().length > 0, [teamName]);
  const allMembersConfigured = useMemo(
    () =>
      activeMembers.every((member) => {
        const profile = memberProfiles[member.id];
        return Boolean(profile?.isConfigured);
      }),
    [activeMembers, memberProfiles]
  );
  const shouldDisableNext =
    (activeStep === 0 && (!pendingTeamSize || !hasTeamName)) ||
    (activeStep === ROLE_STEP_INDEX && (!hasIdeaGenerationRole || !everyMemberHasRole)) ||
    (activeStep === MEMBER_COMPOSITION_STEP_INDEX && !allMembersConfigured);

  useEffect(() => {
    if (!initialPlacementReady) {
      return;
    }
    setNodePositions((previousPositions) => {
      const defaults = computeDefaultNodePositions(activeMembers);
      const nextPositions = {};
      activeMembers.forEach((member) => {
        nextPositions[member.id] = previousPositions[member.id] || defaults[member.id];
      });
      return nextPositions;
    });
  }, [activeMembers, initialPlacementReady]);

  useEffect(() => {
    setRelationships((prevRelationships) =>
      prevRelationships.filter(
        (relationship) =>
          activeMembers.some((member) => member.id === relationship.from) &&
          activeMembers.some((member) => member.id === relationship.to)
      )
    );
  }, [activeMembers]);

  const getMemberLabel = useCallback(
    (memberId) => {
      const member = activeMembers.find((entry) => entry.id === memberId);
      if (!member) {
        return 'this member';
      }
      if (member.id === 'Me') {
        return 'Me';
      }
      return normalizeMemberLabel(member.label, member.id);
    },
    [activeMembers]
  );

  const getSvgCoordinates = (event) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) {
      return { x: 0, y: 0 };
    }
    const scaleX = CANVAS_VIEWBOX.width / rect.width;
    const scaleY = CANVAS_VIEWBOX.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;
    return {
      x: clamp(x, CANVAS_PADDING, CANVAS_VIEWBOX.width - CANVAS_PADDING),
      y: clamp(y, CANVAS_PADDING, CANVAS_VIEWBOX.height - CANVAS_PADDING)
    };
  };

  const handleStartConnecting = () => {
    setIsConnecting(true);
    setConnectingFrom(null);
    setMousePosition(null);
    setSelectedRelationshipType(RELATIONSHIP_TYPES.PEER.id);
  };

  const handleCancelConnecting = () => {
    setIsConnecting(false);
    setConnectingFrom(null);
    setMousePosition(null);
    setSelectedRelationshipType(RELATIONSHIP_TYPES.PEER.id);
  };

  const handleNodeSelection = (nodeId) => {
    if (!isConnecting) {
      return;
    }
    if (!selectedRelationshipType) {
      return;
    }
    if (!connectingFrom) {
      setConnectingFrom(nodeId);
      return;
    }
    if (connectingFrom === nodeId) {
      return;
    }
    addRelationship(connectingFrom, nodeId, selectedRelationshipType);
    setConnectingFrom(null);
    setMousePosition(null);
  };

  const handleNodePointerDown = (event, nodeId) => {
    event.stopPropagation();
    event.preventDefault();
    if (isConnecting && selectedRelationshipType) {
      handleNodeSelection(nodeId);
      return;
    }
    const coords = getSvgCoordinates(event);
    const nodePosition = nodePositions[nodeId] || { x: 50, y: 50 };
    setDraggedNode({
      id: nodeId,
      offsetX: coords.x - nodePosition.x,
      offsetY: coords.y - nodePosition.y
    });
  };

  const handleSvgMouseMove = (event) => {
    if (draggedNode) {
      const coords = getSvgCoordinates(event);
      setNodePositions((prev) => ({
        ...prev,
        [draggedNode.id]: {
          x: clamp(
            coords.x - draggedNode.offsetX,
            CANVAS_PADDING,
            CANVAS_VIEWBOX.width - CANVAS_PADDING
          ),
          y: clamp(
            coords.y - draggedNode.offsetY,
            CANVAS_PADDING,
            CANVAS_VIEWBOX.height - CANVAS_PADDING
          )
        }
      }));
      return;
    }
    if (isConnecting && connectingFrom) {
      setMousePosition(getSvgCoordinates(event));
    }
  };

  const handleSvgMouseUp = () => {
    if (draggedNode) {
      setDraggedNode(null);
    }
    if (!isConnecting) {
      setMousePosition(null);
    }
  };

  const addRelationship = (fromId, toId, type) => {
    if (!type) {
      return;
    }
    setRelationships((prev) => {
      const alreadyExists = prev.some((relationship) => {
        if (type === 'PEER' && relationship.type === 'PEER') {
          return (
            (relationship.from === fromId && relationship.to === toId) ||
            (relationship.from === toId && relationship.to === fromId)
          );
        }
        return (
          relationship.type === type && relationship.from === fromId && relationship.to === toId
        );
      });
      if (alreadyExists) {
        return prev;
      }
      return [...prev, { from: fromId, to: toId, type }];
    });
  };

  const handleRelationshipRemove = (index) => {
    setRelationships((prev) => prev.filter((_, relIndex) => relIndex !== index));
  };

  const relationshipStatusMessage = useMemo(() => {
    if (!isConnecting) {
      return '';
    }
    if (!selectedRelationshipType) {
      return 'Choose a relationship type to start connecting members.';
    }
    const typeLabel = RELATIONSHIP_TYPES[selectedRelationshipType]?.label || 'Peer';
    if (!connectingFrom) {
      return `Select the first member for a ${typeLabel.toLowerCase()} relationship.`;
    }
    return `Select another member to connect with ${getMemberLabel(connectingFrom)}.`;
  }, [connectingFrom, getMemberLabel, isConnecting, selectedRelationshipType]);

  const handleToggleRelationshipPreview = () => {
    setRelationshipPreviewOpen((prev) => !prev);
  };

  const handleMemberChipClick = (index) => {
    setActiveMemberIndex(index);
  };

  const updateMemberProfile = (memberId, updater) => {
    setMemberProfiles((prev) => {
      const profile = prev[memberId] || createEmptyMemberProfile();
      const nextProfile = typeof updater === 'function' ? updater(profile) : { ...profile, ...updater };
      return {
        ...prev,
        [memberId]: nextProfile
      };
    });
  };

  const handleMemberTabChange = (memberId, mode) => {
    updateMemberProfile(memberId, (profile) => ({
      ...profile,
      mode,
      agentId: mode === 'existing' ? profile.agentId : null,
      isConfigured: mode === 'existing' ? Boolean(profile.agentId) : false
    }));
  };

  const handleProfileFieldChange = (memberId, field, value) => {
    updateMemberProfile(memberId, (profile) => ({
      ...profile,
      [field]: value,
      isConfigured: false
    }));
  };

  const handleSkillToggle = (memberId, skill) => {
    updateMemberProfile(memberId, (profile) => {
      const hasSkill = profile.skills.includes(skill);
      return {
        ...profile,
        skills: hasSkill ? profile.skills.filter((entry) => entry !== skill) : [...profile.skills, skill],
        isConfigured: false
      };
    });
  };

  const handleCustomSkillChange = (memberId, value) => {
    updateMemberProfile(memberId, (profile) => ({
      ...profile,
      customSkill: value,
      isConfigured: false
    }));
  };

  const handleAddCustomSkill = (memberId) => {
    updateMemberProfile(memberId, (profile) => {
      const trimmed = profile.customSkill.trim();
      if (!trimmed) {
        return profile;
      }
      if (profile.skills.includes(trimmed)) {
        return { ...profile, customSkill: '' };
      }
      return {
        ...profile,
        skills: [...profile.skills, trimmed],
        customSkill: '',
        isConfigured: false
      };
    });
  };

  const handleSkillRemove = (memberId, skill) => {
    updateMemberProfile(memberId, (profile) => ({
      ...profile,
      skills: profile.skills.filter((entry) => entry !== skill),
      isConfigured: false
    }));
  };

  const handleSaveMemberProfile = (memberId) => {
    updateMemberProfile(memberId, (profile) => ({
      ...profile,
      isConfigured:
        profile.mode === 'existing' ? Boolean(profile.agentId) : Boolean(profile.name)
    }));
  };

  const handleSelectExistingAgent = (memberId, agent) => {
    updateMemberProfile(memberId, () => ({
      mode: 'existing',
      name: agent.name,
      age: agent.age,
      gender: agent.gender,
      education: agent.education,
      occupation: agent.occupation,
      skills: agent.skills,
      personality: agent.personality,
      behavior: agent.behavior,
      likes: agent.likes,
      dislikes: agent.dislikes,
      customSkill: '',
      agentId: agent.id,
      isConfigured: true
    }));
  };

  const handleMemberNavigation = (direction) => {
    setActiveMemberIndex((prev) => {
      const nextIndex = prev + direction;
      if (nextIndex < 0 || nextIndex >= orderedMembers.length) {
        return prev;
      }
      return nextIndex;
    });
  };

  const handleCompleteTeam = () => {
    setIsComplete(true);
  };

  const handleResetFlow = () => {
    setHasStarted(false);
    setIsComplete(false);
    setActiveStep(0);
    setTeamSize(0);
    setPendingTeamSize(null);
    setTeamName('');
    setTopic('');
    setMembers([]);
    setMemberProfiles({});
    setActiveMemberIndex(0);
    setSharedMentalModel('');
    setRelationships([]);
    setNodePositions({});
    setInitialPlacementReady(false);
    setIsConnecting(false);
    setConnectingFrom(null);
    setMousePosition(null);
    setDraggedNode(null);
    setSelectedRelationshipType(null);
    setRelationshipPreviewOpen(false);
    setRoleRelationshipPreviewOpen(false);
  };


  const toggleRole = (memberId, role) => {
    setMembers((prevMembers) =>
      prevMembers.map((member) => {
        if (member.id !== memberId) {
          return member;
        }
        const hasRole = member.roles.includes(role);
        return {
          ...member,
          roles: hasRole ? member.roles.filter((entry) => entry !== role) : [...member.roles, role]
        };
      })
    );
  };

  const renderRelationshipCanvas = ({ readOnly = false } = {}) => {
    const canvasClassName = ['crafteam-relationship-canvas'];
    if (readOnly) {
      canvasClassName.push('crafteam-relationship-canvas--readonly');
    }
    return (
      <div className={canvasClassName.join(' ')} aria-label="Team relationship editor">
        <svg
          ref={readOnly ? undefined : svgRef}
          viewBox={`0 0 ${CANVAS_VIEWBOX.width} ${CANVAS_VIEWBOX.height}`}
          height={CANVAS_VIEWBOX.height}
          preserveAspectRatio="xMidYMid meet"
          onMouseMove={readOnly ? undefined : handleSvgMouseMove}
          onMouseUp={readOnly ? undefined : handleSvgMouseUp}
          onMouseLeave={readOnly ? undefined : handleSvgMouseUp}
        >
          <defs>
            <marker
              id="crafteam-arrow-superior"
              markerWidth="12"
              markerHeight="12"
              refX="11"
              refY="6"
              orient="auto-start-reverse"
            >
              <path
                d="M0,0 L12,6 L0,12 z"
                fill={isDark ? '#ffffff' : RELATIONSHIP_TYPES.SUPERIOR.color}
              />
            </marker>
          </defs>
          {relationships.map((relationship, index) => {
            const fromNode = nodePositions[relationship.from];
            const toNode = nodePositions[relationship.to];
            if (!fromNode || !toNode) {
              return null;
            }
            const dx = toNode.x - fromNode.x;
            const dy = toNode.y - fromNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;
            const unitX = dx / distance;
            const unitY = dy / distance;
            const style = RELATIONSHIP_TYPES[relationship.type] || RELATIONSHIP_TYPES.PEER;
            const startX = fromNode.x + unitX * NODE_OUTER_RADIUS;
            const startY = fromNode.y + unitY * NODE_OUTER_RADIUS;
            const endX = toNode.x - unitX * NODE_OUTER_RADIUS;
            const endY = toNode.y - unitY * NODE_OUTER_RADIUS;
            const midX = (startX + endX) / 2;
            const midY = (startY + endY) / 2;
            const strokeColor = isDark ? '#ffffff' : style.color;
            return (
              <g key={`${relationship.from}-${relationship.to}-${index}`} className="crafteam-relationship-edge">
                {!readOnly && (
                  <line
                    x1={startX}
                    y1={startY}
                    x2={endX}
                    y2={endY}
                    stroke="transparent"
                    strokeWidth={NODE_OUTER_RADIUS * 1.6}
                    onClick={() => handleRelationshipRemove(index)}
                  />
                )}
                <text
                  className="crafteam-relationship-line__label"
                  x={midX}
                  y={midY - 10}
                  fill={strokeColor}
                >
                  {style.label}
                </text>
                <line
                  className="crafteam-relationship-line"
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke={strokeColor}
                  strokeWidth={style.strokeWidth}
                  strokeDasharray={style.dasharray || undefined}
                  markerEnd={style.markerId ? `url(#${style.markerId})` : undefined}
                />
                {!readOnly && (
                  <g
                    className="crafteam-relationship-edge__remove"
                    transform={`translate(${midX}, ${midY - 24})`}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleRelationshipRemove(index);
                    }}
                  >
                    <circle r="13" />
                    <text x="0" y="5" textAnchor="middle">
                      ×
                    </text>
                  </g>
                )}
              </g>
            );
          })}
          {!readOnly && isConnecting && selectedRelationshipType && connectingFrom && mousePosition && (
            <line
              className="crafteam-relationship-line crafteam-relationship-line--draft"
              x1={nodePositions[connectingFrom]?.x || CANVAS_VIEWBOX.width / 2}
              y1={nodePositions[connectingFrom]?.y || CANVAS_VIEWBOX.height / 2}
              x2={mousePosition.x}
              y2={mousePosition.y}
            />
          )}
          {activeMembers.map((member) => {
            const position =
              nodePositions[member.id] || { x: CANVAS_VIEWBOX.width / 2, y: CANVAS_VIEWBOX.height / 2 };
            const isHuman = member.id === 'Me';
            const isActiveNode = !readOnly && connectingFrom === member.id;
            const ringClassName = [
              'crafteam-relationship-node-ring',
              isActiveNode ? 'is-active' : '',
              isHuman ? 'is-human' : ''
            ]
              .filter(Boolean)
              .join(' ');
            const coreClassName = ['crafteam-relationship-node-core', isHuman ? 'is-human' : '']
              .filter(Boolean)
              .join(' ');
            return (
              <g
                key={`relationship-node-${member.id}`}
                className="crafteam-relationship-node-group"
                onMouseDown={
                  readOnly ? undefined : (event) => handleNodePointerDown(event, member.id)
                }
                style={{
                  cursor: readOnly ? 'default' : isConnecting && selectedRelationshipType ? 'pointer' : 'grab'
                }}
              >
                <circle cx={position.x} cy={position.y} r={NODE_OUTER_RADIUS} className={ringClassName} />
                <circle cx={position.x} cy={position.y} r={NODE_INNER_RADIUS} className={coreClassName} />
                <text className="crafteam-relationship-node__initial" x={position.x} y={position.y + 1} pointerEvents="none">
                  {member.id === 'Me' ? 'Me' : member.id}
                </text>
                <text
                  className="crafteam-relationship-node__label"
                  x={position.x}
                  y={position.y + NODE_OUTER_RADIUS + 12}
                  pointerEvents="none"
                >
                  {getMemberLabel(member.id)}
                </text>
                <text
                  className="crafteam-relationship-node__sublabel"
                  x={position.x}
                  y={position.y + NODE_OUTER_RADIUS + 24}
                  pointerEvents="none"
                >
                  {member.id === 'Me' ? 'You' : 'AI'}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (STEPS[activeStep].id) {
      case 'size':
        return (
          <div className="crafteam-step crafteam-step--basic">
            <div className="crafteam-step__intro">
              <h3>Step 1: Basic Team Information</h3>
              <p>Please set your team name and the number of AI team members.</p>
            </div>
            <div className="crafteam-basic-grid">
              <div className="crafteam-field">
                <label htmlFor="crafteam-team-name">Team Name *</label>
                <input
                  id="crafteam-team-name"
                  type="text"
                  value={teamName}
                  onChange={(event) => setTeamName(event.target.value)}
                  className="crafteam-input"
                  placeholder="Enter your team name"
                />
                <p className="crafteam-field__hint">e.g., Studio North Star</p>
              </div>
              <div className="crafteam-field">
                <label htmlFor="crafteam-topic">Ideation Topic *</label>
                <input
                  id="crafteam-topic"
                  type="text"
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                  className="crafteam-input"
                  placeholder="e.g., Enter the team's focus area"
                />
                <p className="crafteam-field__hint">
                  Enter the topic for the team to discuss and generate ideas together.
                </p>
              </div>
            </div>
            <div className="crafteam-field-group">
              <label>Total Team Composition *</label>
              <p>Your team will consist of you + AI members.</p>
              <div className="crafteam-composition-options">
                {TEAM_COMPOSITION_OPTIONS.map((option) => {
                  const isSelected = pendingTeamSize === option.totalMembers;
                  return (
                    <button
                      type="button"
                      key={option.id}
                      className={`crafteam-composition-option${isSelected ? ' is-selected' : ''}`}
                      onClick={() => {
                        setPendingTeamSize(option.totalMembers);
                        setInitialPlacementReady(false);
                      }}
                    >
                      <div className="crafteam-composition-option__headline">
                        <span>{option.label}</span>
                        <span
                          className={`crafteam-composition-option__icon${
                            isSelected ? ' is-selected' : ''
                          }`}
                          aria-hidden="true"
                        />
                      </div>
                      <p>{option.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="crafteam-team-preview">
              <div className="crafteam-team-preview__header">
                <h4>Team Structure Preview</h4>
              </div>
              <div className="crafteam-team-preview__chips">
                {previewMembers.map((member) => (
                  <div
                    key={member.id}
                    className={`crafteam-team-preview__chip${
                      member.id === 'Me' ? ' is-human' : ''
                    }`}
                  >
                    <span className="crafteam-team-preview__chip-avatar">
                      {member.id === 'Me' ? 'Me' : member.id}
                    </span>
                    <span className="crafteam-team-preview__chip-label">
                      {member.id === 'Me' ? 'Me' : `Member ${member.id}`}
                    </span>
                    {member.id !== 'Me' && (
                      <span className="crafteam-team-preview__chip-subtext">(AI)</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'structure':
        return (
          <div className="crafteam-step crafteam-step--relationships">
            <div className="crafteam-step__intro">
              <h3>Step 2: Set Team Relationships</h3>
              <p>Set the relationships among team members to create a more realistic team dynamic.</p>
            </div>
            <div className="crafteam-relationship-panels">
              <div className="crafteam-relationship-card">
                <div className="crafteam-relationship-card__header">
                  <span className="crafteam-relationship-card__icon" aria-hidden="true">
                    💡
                  </span>
                  <h4>How to use</h4>
                </div>
                <ul>
                  <li>Click the "Connect Relationship" button to start setting relationships.</li>
                  <li>Click on nodes to create relationships and select the relationship type.</li>
                  <li>Click on an existing connection to delete it.</li>
                  <li>Drag nodes to freely rearrange their positions.</li>
                </ul>
              </div>
              <div className="crafteam-relationship-card">
                <div className="crafteam-relationship-card__header">
                  <span className="crafteam-relationship-card__icon" aria-hidden="true">
                    📋
                  </span>
                  <h4>Relationship Setting Guide</h4>
                </div>
                <p>
                  <strong>Peer Relationship:</strong> A reciprocal relationship where feedback and
                  requests are possible.
                </p>
                <p>
                  <strong>Superior–Subordinate Relationship:</strong> The direction of the arrow
                  matters.
                </p>
                <ul>
                  <li>The person the arrow points to is the subordinate.</li>
                  <li>The person where the arrow starts is the superior.</li>
                  <li>Example: A → B (A is superior, B is subordinate)</li>
                </ul>
              </div>
            </div>
            <div className="crafteam-relationship-toolbar">
              <div className="crafteam-relationship-button-wrapper">
                <button
                  type="button"
                  className={`crafteam-relationship-button${isConnecting ? ' is-active' : ''}`}
                  onClick={isConnecting ? handleCancelConnecting : handleStartConnecting}
                >
                  + Connecting Relationships
                </button>
              </div>
              {isConnecting && (
                <div className="crafteam-relationship-type-buttons">
                  {RELATIONSHIP_TYPE_LIST.map((option) => (
                    <button
                      type="button"
                      key={option.id}
                      className={`crafteam-relationship-type-button${
                        selectedRelationshipType === option.id ? ' is-selected' : ''
                      }`}
                      onClick={() => {
                        setSelectedRelationshipType(option.id);
                        setConnectingFrom(null);
                        setMousePosition(null);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {relationshipStatusMessage && (
              <p className="crafteam-relationship-status-text">{relationshipStatusMessage}</p>
            )}
            {renderRelationshipCanvas()}
          </div>
        );
      case 'roles':
        return (
          <div className="crafteam-step crafteam-step--roles">
            <div className="crafteam-step__intro">
              <h3>Step 3: Role Assignment</h3>
              <p>Assign roles to team members.</p>
            </div>
            <div className="crafteam-relations-preview">
              <button
                type="button"
                className="crafteam-relations-preview__toggle"
                onClick={() => setRoleRelationshipPreviewOpen((prev) => !prev)}
              >
                <span>👥 Configured Team Relationships</span>
                <span
                  className={`crafteam-toggle-icon${roleRelationshipPreviewOpen ? ' is-open' : ''}`}
                  aria-hidden="true"
                  style={toggleIconStyle}
                />
              </button>
              {roleRelationshipPreviewOpen && (
                <div className="crafteam-relations-preview__body crafteam-relations-preview__body--graph">
                  {relationships.length ? (
                    renderRelationshipCanvas({ readOnly: true })
                  ) : (
                    <p>No relationships configured yet.</p>
                  )}
                </div>
              )}
            </div>

            <div className="crafteam-role-list">
              {members.map((member) => (
                <div key={member.id} className="crafteam-role-card crafteam-role-card--simple">
                  <div className="crafteam-role-card__summary">
                    <div className={`crafteam-role-card__avatar${member.id === 'Me' ? ' is-human' : ''}`}>
                      {member.id === 'Me' ? 'Me' : member.id}
                    </div>
                    <div className="crafteam-role-card__summary-text">
                      <span className="crafteam-role-card__summary-title">
                        {member.id === 'Me' ? 'Me' : `Member ${member.id}`}
                      </span>
                      <span className="crafteam-role-card__summary-status">
                        {member.roles.length} roles selected
                      </span>
                    </div>
                  </div>
                  <div className="crafteam-role-grid-simple">
                    {ROLE_LIBRARY.map((role) => {
                      const isActive = member.roles.includes(role);
                      return (
                        <button
                          type="button"
                          key={`${member.id}-${role}`}
                          className={`crafteam-role-button${isActive ? ' is-active' : ''}`}
                          onClick={() => toggleRole(member.id, role)}
                        >
                          {role}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            {hasIdeaGenerationRole ? (
              !everyMemberHasRole && (
                <div className="crafteam-role-alert">
                  Please assign at least one role to each member.
                </div>
              )
            ) : (
              <div className="crafteam-role-alert">
                At least one member must include the Idea Generation role before you continue.
              </div>
            )}
          </div>
        );
      case 'member-composition':
        return (
          <div className="crafteam-step crafteam-step--members">
            <div className="crafteam-step__intro">
              <h3>Step 4: Create AI Team Members</h3>
              <p>Create new AI or bring existing collaborators to complete your roster.</p>
            </div>
            <div className="crafteam-relations-preview">
              <button
                type="button"
                className="crafteam-relations-preview__toggle"
                onClick={handleToggleRelationshipPreview}
              >
                <span>👥 Configured Team Relationships</span>
                <span
                  className={`crafteam-toggle-icon${relationshipPreviewOpen ? ' is-open' : ''}`}
                  aria-hidden="true"
                  style={toggleIconStyle}
                />
              </button>
              {relationshipPreviewOpen && (
                <div className="crafteam-relations-preview__body crafteam-relations-preview__body--graph">
                  {relationships.length ? (
                    renderRelationshipCanvas({ readOnly: true })
                  ) : (
                    <p>No relationships configured yet.</p>
                  )}
                </div>
              )}
            </div>
            <div className="crafteam-member-config">
              <div className="crafteam-member-config__header">
                <p>Team Member Configuration</p>
                <span className="crafteam-member-config__count">
                  {Math.min(activeMemberIndex + 1, orderedMembers.length)} / {orderedMembers.length}
                </span>
              </div>
              <div className="crafteam-member-tabs">
                {orderedMembers.map((member, index) => {
                  const profile = memberProfiles[member.id];
                  const isActive = index === activeMemberIndex;
                  const isConfigured = profile?.isConfigured;
                  return (
                    <button
                      type="button"
                      key={member.id}
                      className={`crafteam-member-tab${isActive ? ' is-active' : ''}${isConfigured ? ' is-complete' : ''}`}
                      onClick={() => handleMemberChipClick(index)}
                    >
                      <span
                        className={`crafteam-member-tab__avatar${member.id === 'Me' ? ' is-human' : ''}`}
                      >
                        {member.id === 'Me' ? 'Me' : member.id}
                      </span>
                      <span className="crafteam-member-tab__body">
                        <span className="crafteam-member-tab__label">
                          {member.id === 'Me' ? 'Me' : `Team member ${member.id}`}
                        </span>
                        {!isConfigured && (
                          <span className="crafteam-member-tab__status">Not configured</span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
              {currentMember && currentProfile && (
                <div className="crafteam-member-panel">
                  <div className="crafteam-member-panel__summary">
                    <div className="crafteam-member-panel__summary-avatar">
                      {currentMember.id === 'Me' ? 'Me' : currentMember.id}
                    </div>
                    <div>
                      <h4>{currentMember.id === 'Me' ? 'Me' : `Team member ${currentMember.id}`}</h4>
                      <p>Roles: {currentMember.roles.join(', ') || 'None assigned'}</p>
                    </div>
                  </div>
                  <div className="crafteam-member-panel__tabs">
                    <button
                      type="button"
                      className={`crafteam-member-panel__tab${currentProfile.mode !== 'existing' ? ' is-active' : ''}`}
                      onClick={() => handleMemberTabChange(currentMember.id, 'create')}
                    >
                      Create New
                    </button>
                    <button
                      type="button"
                      className={`crafteam-member-panel__tab${currentProfile.mode === 'existing' ? ' is-active' : ''}`}
                      onClick={() => handleMemberTabChange(currentMember.id, 'existing')}
                    >
                      Select Existing ({EXISTING_AGENT_LIBRARY.length})
                    </button>
                  </div>
                  {currentProfile.mode === 'existing' ? (
                    <div className="crafteam-existing-library">
                      <p>Select an existing member to reuse their configuration.</p>
                      <div className="crafteam-existing-library__grid">
                        {EXISTING_AGENT_LIBRARY.map((agent) => {
                          const isUsed = isAgentInUse(agent.id, currentMember.id);
                          const isSelected = currentProfile.agentId === agent.id;
                          return (
                            <button
                              type="button"
                              key={agent.id}
                              className={`crafteam-existing-card${isSelected ? ' is-selected' : ''}${
                                isUsed ? ' is-disabled' : ''
                              }`}
                              onClick={() => !isUsed && handleSelectExistingAgent(currentMember.id, agent)}
                              disabled={isUsed}
                            >
                              <div className="crafteam-existing-card__icon">{agent.name.charAt(0)}</div>
                              <div className="crafteam-existing-card__body">
                                <h5>{agent.name}</h5>
                                <p>{agent.occupation}</p>
                                <span>
                                  {agent.age}, {agent.gender}
                                </span>
                              </div>
                              {isUsed && <span className="crafteam-existing-card__badge">In use</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="crafteam-member-form">
                          <div className="crafteam-form-grid">
                            <label className="crafteam-form-field">
                              <span>Name *</span>
                              <input
                                type="text"
                                value={currentProfile.name}
                                onChange={(event) => handleProfileFieldChange(currentMember.id, 'name', event.target.value)}
                                placeholder="e.g., Vicky"
                              />
                            </label>
                            <label className="crafteam-form-field">
                              <span>Age</span>
                              <input
                                type="number"
                                value={currentProfile.age}
                                onChange={(event) => handleProfileFieldChange(currentMember.id, 'age', event.target.value)}
                                placeholder="e.g., 28"
                              />
                            </label>
                            <label className="crafteam-form-field">
                              <span>Gender</span>
                              <select
                                value={currentProfile.gender}
                                onChange={(event) => handleProfileFieldChange(currentMember.id, 'gender', event.target.value)}
                              >
                                <option value="">Please select...</option>
                                {GENDER_OPTIONS.map((option) => (
                                  <option key={option} value={option}>{option}</option>
                                ))}
                              </select>
                            </label>
                            <label className="crafteam-form-field">
                              <span>Education Level</span>
                              <select
                                value={currentProfile.education}
                                onChange={(event) => handleProfileFieldChange(currentMember.id, 'education', event.target.value)}
                              >
                                <option value="">Please select...</option>
                                {EDUCATION_OPTIONS.map((option) => (
                                  <option key={option} value={option}>{option}</option>
                                ))}
                              </select>
                            </label>
                          </div>
                          <label className="crafteam-form-field">
                            <span>Occupation / Expertise</span>
                            <input
                              type="text"
                              value={currentProfile.occupation}
                              onChange={(event) => handleProfileFieldChange(currentMember.id, 'occupation', event.target.value)}
                              placeholder="e.g., Creative Technologist"
                            />
                          </label>
                          <div className="crafteam-member-skills">
                            <div className="crafteam-member-skills__header">
                              <span>Skill set</span>
                              <small>Select from the list below.</small>
                            </div>
                            <div className="crafteam-skill-pills">
                              {DEFAULT_SKILL_OPTIONS.map((skill) => {
                                const isActive = currentProfile.skills.includes(skill);
                                return (
                                  <button
                                    type="button"
                                    key={skill}
                                    className={`crafteam-skill-button${isActive ? ' is-active' : ''}`}
                                    onClick={() => handleSkillToggle(currentMember.id, skill)}
                                  >
                                    {skill}
                                  </button>
                                );
                              })}
                            </div>
                            <div className="crafteam-skill-add">
                              <input
                                type="text"
                                value={currentProfile.customSkill}
                                onChange={(event) => handleCustomSkillChange(currentMember.id, event.target.value)}
                                placeholder="Enter a new skill..."
                              />
                              <button type="button" onClick={() => handleAddCustomSkill(currentMember.id)}>
                                + Add
                              </button>
                            </div>
                          </div>
                          {currentProfile.skills.length > 0 && (
                            <div className="crafteam-selected-skills">
                              {currentProfile.skills.map((skill) => (
                                <button
                                  type="button"
                                  key={`${currentMember.id}-${skill}-selected`}
                                  className="crafteam-selected-skill"
                                  onClick={() => handleSkillRemove(currentMember.id, skill)}
                                >
                                  <span>{skill}</span>
                                  <span className="crafteam-selected-skill__remove" aria-label={`Remove ${skill}`}>
                                    ×
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                          <label className="crafteam-form-field">
                            <span>Personality</span>
                            <input
                              type="text"
                              value={currentProfile.personality}
                              onChange={(event) => handleProfileFieldChange(currentMember.id, 'personality', event.target.value)}
                              placeholder="e.g., maintains a positive outlook."
                            />
                          </label>
                          <label className="crafteam-form-field">
                            <span>Behavior</span>
                            <input
                              type="text"
                              value={currentProfile.behavior}
                              onChange={(event) => handleProfileFieldChange(currentMember.id, 'behavior', event.target.value)}
                              placeholder="e.g., proactive in sharing updates."
                            />
                          </label>
                          <label className="crafteam-form-field">
                            <span>Likes</span>
                            <input
                              type="text"
                              value={currentProfile.likes}
                              onChange={(event) => handleProfileFieldChange(currentMember.id, 'likes', event.target.value)}
                              placeholder="e.g., emerging tech trends."
                            />
                          </label>
                          <label className="crafteam-form-field">
                            <span>Dislikes</span>
                            <input
                              type="text"
                              value={currentProfile.dislikes}
                              onChange={(event) => handleProfileFieldChange(currentMember.id, 'dislikes', event.target.value)}
                              placeholder="e.g., decisions without data."
                            />
                          </label>
                      <button
                        type="button"
                        className="crafteam-button crafteam-button--ghost"
                        onClick={() => handleSaveMemberProfile(currentMember.id)}
                        disabled={!currentProfile.name.trim()}
                      >
                        Save
                      </button>
                        </div>
                      )}
                  <div className="crafteam-member-panel__actions">
                        <button
                          type="button"
                          className="crafteam-button crafteam-button--outline"
                          onClick={() => handleMemberNavigation(-1)}
                          disabled={activeMemberIndex === 0}
                        >
                          Previous Member
                        </button>
                    <button
                      type="button"
                      className="crafteam-button crafteam-button--outline"
                          onClick={() => handleMemberNavigation(1)}
                          disabled={activeMemberIndex === orderedMembers.length - 1}
                        >
                          Next Member
                        </button>
                      </div>
                </div>
              )}
            </div>
          </div>
        );
      case 'shared-model':
        return (
          <div className="crafteam-step crafteam-step--shared crafteam-step--shared--single">
            <div className="crafteam-step__intro">
              <h3>Step 5: Shared Mental Model</h3>
              <p>Set up your team's shared mental model. This will be reflected in the AI agents of your team members.</p>
            </div>
            <div className="crafteam-shared-panel">
              <div className="crafteam-shared-panel__intro">
                <div className="crafteam-shared-panel__header">
                  <span className="crafteam-shared-panel__icon" aria-hidden="true">
                    💡
                  </span>
                  <h4>What is a Shared Mental Model?</h4>
                </div>
                <p>
                  A Shared Mental Model refers to team members sharing common knowledge, beliefs, and assumptions about specific tasks or situations to enhance team efficiency.
                </p>
                <p>
                  Please describe the task-related knowledge your team should share (procedures, strategies, and goals) and team-related knowledge (attitudes, beliefs, or understanding about teammates).
                </p>
              </div>
              <label className="crafteam-form-field">
                <span>Shared Mental Model *</span>
                <textarea
                  id="sharedMentalModel"
                  value={sharedMentalModel}
                  onChange={(event) => setSharedMentalModel(event.target.value)}
                  rows={10}
                  placeholder="e.g., Our team pursues user-centered and innovative ideas. All members share creative thinking through open communication, embrace challenges, and are not afraid of failure..."
                />
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleNext = () => {
    if (activeStep === 0) {
      handleTeamSizeCommit();
    }
    setActiveStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const handlePrev = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  if (isComplete) {
    return (
      <div className="crafteam-ui" ref={fadeRef}>
        <div className="crafteam-complete">
          <p className="crafteam-ui__eyebrow">Team builder</p>
          <h3>Team Successfully Created</h3>
          <div className="crafteam-complete__actions">
            <button type="button" className="crafteam-button" onClick={handleResetFlow}>
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="crafteam-ui" ref={fadeRef}>
      {!hasStarted ? (
        <div className="crafteam-ui__start">
          <div>
            <p className="crafteam-ui__eyebrow">Team builder preview</p>
            <h3>Craft Your Own Team for Ideation</h3>
          </div>
          <button type="button" className="crafteam-button" onClick={() => setHasStarted(true)}>
            Create New Team
          </button>
        </div>
      ) : (
        <div className="crafteam-ui__body">
          <div className="crafteam-stepper">
            {STEPS.map((step, index) => {
              const status = index === activeStep ? 'current' : index < activeStep ? 'done' : 'upcoming';
              return (
        <div key={step.id} className={`crafteam-stepper__step is-${status}`}>
          <div className="crafteam-stepper__dot">
            <span>{index + 1}</span>
          </div>
          <p className="crafteam-stepper__label">
            {step.id === 'member-composition'
              ? 'Member\nComposition'
              : step.id === 'shared-model'
              ? 'Shared Mental\nModel'
              : step.label}
          </p>
        </div>
              );
            })}
          </div>
          <section className="crafteam-step-panel">
            {renderStepContent()}
            <div className="crafteam-step-panel__actions">
              <button
                type="button"
                className="crafteam-button crafteam-button--outline"
                onClick={handlePrev}
                disabled={activeStep === 0}
              >
                Previous
              </button>
              {activeStep === STEPS.length - 1 ? (
                <button type="button" className="crafteam-button" onClick={handleCompleteTeam}>
                  Craft Own Team
                </button>
              ) : (
                <button
                  type="button"
                  className="crafteam-button"
                  onClick={handleNext}
                  disabled={shouldDisableNext}
                >
                  Next step
                </button>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

CrafteamUI.propTypes = {
  fadeRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })])
};

CrafteamUI.defaultProps = {
  fadeRef: undefined
};
