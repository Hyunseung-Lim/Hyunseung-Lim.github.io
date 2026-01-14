import { useMemo } from 'react';
import structuredTeams from '../../../Data/structured_teams.json';

const GRAPH_WIDTH = 260;
const GRAPH_HEIGHT = 200;
const GRAPH_PADDING = 32;
const OWNER_NODE_RADIUS = 14;
const AGENT_NODE_RADIUS = 10;

const safeParseJSON = (value, fallback) => {
  if (!value || typeof value !== 'string') {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const calculateActivityStats = (chatMessages = []) => {
  if (!Array.isArray(chatMessages) || chatMessages.length === 0) {
    return { ideaGeneration: 0, evaluation: 0, feedback: 0, request: 0 };
  }

  let ideaGeneration = 0;
  let evaluation = 0;
  let feedback = 0;
  let request = 0;

  chatMessages.forEach((message) => {
    if (typeof message === 'string') {
      try {
        message = JSON.parse(message);
      } catch {
        return;
      }
    }

    if (message?.type === 'system' && typeof message.payload === 'object') {
      const content = message.payload?.content ?? '';
      if (typeof content === 'string') {
        if (content.includes('아이디어를 생성')) {
          ideaGeneration += 1;
        } else if (content.includes('아이디어를 평가')) {
          evaluation += 1;
        } else if (content.includes('피드백')) {
          feedback += 1;
        }
      }
    } else if (message?.type === 'make_request') {
      request += 1;
    } else if (message?.type === 'feedback_session_summary') {
      feedback += 1;
    }
  });

  return { ideaGeneration, evaluation, feedback, request };
};

const buildAgentLookups = (team) => {
  const agents = Array.isArray(team.agents) ? team.agents : [];
  const byId = new Map();
  const byNodeKey = new Map();

  agents.forEach((agent) => {
    if (agent.agentId) {
      byId.set(agent.agentId, agent);
    }
    if (agent.node_key) {
      byNodeKey.set(agent.node_key, agent);
    }
  });

  return { byId, byNodeKey };
};

const normalizePositions = (team, ownerGraphLabel = 'Me') => {
  const nodePositions = safeParseJSON(team.team_info?.nodePositions, {});
  const hasPositions = nodePositions && Object.keys(nodePositions).length > 0;
  const { byNodeKey } = buildAgentLookups(team);
  const nodes = [];

  if (hasPositions) {
    Object.entries(nodePositions).forEach(([nodeKey, position]) => {
      if (!position || typeof position.x !== 'number' || typeof position.y !== 'number') {
        return;
      }

      if (nodeKey === '나') {
        nodes.push({
          id: 'owner',
          key: '나',
          label: ownerGraphLabel,
          type: 'owner',
          x: position.x,
          y: position.y,
          radius: OWNER_NODE_RADIUS
        });
        return;
      }

      if (byNodeKey.has(nodeKey)) {
        const agent = byNodeKey.get(nodeKey);
        nodes.push({
          id: agent.agentId ?? nodeKey,
          key: nodeKey,
          label: agent.agent_info?.name ?? nodeKey,
          type: 'agent',
          x: position.x,
           y: position.y,
          radius: AGENT_NODE_RADIUS
        });
      }
    });
  }

  if (nodes.length === 0) {
    // fallback layout: owner at center, agents arranged radially
    const agents = Array.from(byNodeKey.values());
    const nodeCount = Math.min(agents.length, 6);
    const radius = Math.min(GRAPH_WIDTH, GRAPH_HEIGHT) / 2 - GRAPH_PADDING;

    nodes.push({
      id: 'owner',
      key: '나',
      label: ownerGraphLabel,
      type: 'owner',
      x: GRAPH_WIDTH / 2,
      y: GRAPH_HEIGHT / 2,
      radius: OWNER_NODE_RADIUS
    });

    for (let index = 0; index < nodeCount; index += 1) {
      const agent = agents[index];
      const angle = (index / Math.max(1, nodeCount)) * Math.PI * 2;
      nodes.push({
        id: agent.agentId ?? `agent-${index}`,
        key: agent.node_key ?? `agent-${index}`,
        label: agent.agent_info?.name ?? agent.node_key ?? `Agent ${index + 1}`,
        type: 'agent',
        x: GRAPH_WIDTH / 2 + radius * Math.cos(angle),
        y: GRAPH_HEIGHT / 2 + radius * Math.sin(angle),
        radius: AGENT_NODE_RADIUS
      });
    }

    return nodes;
  }

  const [minX, maxX] = nodes.reduce(
    ([min, max], node) => [Math.min(min, node.x), Math.max(max, node.x)],
    [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]
  );
  const [minY, maxY] = nodes.reduce(
    ([min, max], node) => [Math.min(min, node.y), Math.max(max, node.y)],
    [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]
  );

  const scaleX = (GRAPH_WIDTH - GRAPH_PADDING * 2) / Math.max(1, maxX - minX);
  const scaleY = (GRAPH_HEIGHT - GRAPH_PADDING * 2) / Math.max(1, maxY - minY);

  return nodes.map((node) => ({
    ...node,
    x: GRAPH_PADDING + (node.x - minX) * scaleX,
    y: GRAPH_HEIGHT - GRAPH_PADDING - (node.y - minY) * scaleY,
    radius: node.radius ?? (node.type === 'owner' ? OWNER_NODE_RADIUS : AGENT_NODE_RADIUS)
  }));
};

const buildEdges = (team, nodes) => {
  const nodeMap = new Map(nodes.map((node) => [node.key, node]));
  const { byId } = buildAgentLookups(team);
  const relationships = safeParseJSON(team.team_info?.relationships, []);

  if (!Array.isArray(relationships) || relationships.length === 0) {
    return [];
  }

  return relationships
    .map((relationship) => {
      let fromKey = relationship.from;
      let toKey = relationship.to;

      if (fromKey !== '나') {
        const agent = byId.get(fromKey);
        fromKey = agent?.node_key;
      }

      if (toKey !== '나') {
        const agent = byId.get(toKey);
        toKey = agent?.node_key;
      }

      if (!fromKey || !toKey) {
        return null;
      }

      const fromNode = nodeMap.get(fromKey === '나' ? '나' : fromKey);
      const toNode = nodeMap.get(toKey === '나' ? '나' : toKey);

      if (!fromNode || !toNode) {
        return null;
      }

      return {
        id: `${fromNode.id}-${toNode.id}-${relationship.type}`,
        from: fromNode,
        to: toNode,
        type: relationship.type
      };
    })
    .filter(Boolean);
};

const TeamStructureStat = ({ label, value }) => (
  <div className="crafteam-team-card__stat">
    <span className="crafteam-team-card__stat-value">{value}</span>
    <span className="crafteam-team-card__stat-label">{label}</span>
  </div>
);

const TeamStructureGraph = ({ team, ownerLabel = 'Me', participantLabel }) => {
  const nodes = useMemo(() => normalizePositions(team, ownerLabel), [team, ownerLabel]);
  const edges = useMemo(() => buildEdges(team, nodes), [team, nodes]);

  return (
    <svg
      className="crafteam-team-graph"
      viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`${participantLabel ?? ownerLabel} team structure`}
    >
      <defs>
        <marker
          id="crafteam-arrow-solid"
          markerWidth="10"
          markerHeight="10"
          refX="8"
          refY="5"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="#4c59c7" />
        </marker>
        <marker
          id="crafteam-arrow-dashed"
          markerWidth="10"
          markerHeight="10"
          refX="8"
          refY="5"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill="#8590d3" />
        </marker>
      </defs>

      {edges.map((edge) => {
        const dx = edge.to.x - edge.from.x;
        const dy = edge.to.y - edge.from.y;
        const length = Math.hypot(dx, dy) || 1;
        const startOffset = edge.from.radius ?? AGENT_NODE_RADIUS;
        const endOffset = (edge.to.radius ?? AGENT_NODE_RADIUS) + 4;
        const startX = edge.from.x + (dx / length) * startOffset;
        const startY = edge.from.y + (dy / length) * startOffset;
        const endX = edge.to.x - (dx / length) * endOffset;
        const endY = edge.to.y - (dy / length) * endOffset;

        const edgeClass = `crafteam-team-graph__edge crafteam-team-graph__edge--${edge.type?.toLowerCase?.() ?? 'peer'}`;
        const markerEnd = edge.type === 'SUPERVISOR' ? 'url(#crafteam-arrow-solid)' : undefined;

        return (
          <line
            key={edge.id}
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            className={edgeClass}
            markerEnd={markerEnd}
          />
        );
      })}

      {nodes.map((node) => (
        <g key={node.id} className="crafteam-team-graph__node" transform={`translate(${node.x}, ${node.y})`}>
          <circle
            r={node.radius ?? (node.type === 'owner' ? OWNER_NODE_RADIUS : AGENT_NODE_RADIUS)}
            className={`crafteam-team-graph__node-circle crafteam-team-graph__node-circle--${node.type}`}
          />
          <text className="crafteam-team-graph__node-label" dy={node.type === 'owner' ? 32 : 26}>
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
};

export const CrafteamTeamStructure = ({ fadeRef }) => {
  const participants = useMemo(() => {
    const participantOrder = new Map();
    const teamCounts = new Map();
    const groupedTeams = new Map();

    structuredTeams.forEach((team) => {
      const ownerId = team.owner_info?.id ?? team.owner_info?.email ?? `owner-${team.team_id}`;

      if (!participantOrder.has(ownerId)) {
        participantOrder.set(ownerId, participantOrder.size + 1);
      }

      const participantIndex = participantOrder.get(ownerId);
      const nextCount = (teamCounts.get(ownerId) ?? 0) + 1;
      teamCounts.set(ownerId, nextCount);

      if (!groupedTeams.has(ownerId)) {
        groupedTeams.set(ownerId, {
          participantLabel: `P${participantIndex}`,
          participantIndex,
          teams: []
        });
      }

      groupedTeams.get(ownerId)?.teams.push({
        team,
        participantIndex,
        participantLabel: `P${participantIndex}`,
        teamSequence: nextCount
      });
    });

    return Array.from(groupedTeams.values()).sort(
      (a, b) => a.participantIndex - b.participantIndex
    );
  }, []);

  return (
    <div className="crafteam-team-grid">
      {participants.map(({ participantLabel, participantIndex, teams }) => (
        <div className="crafteam-team-row" key={`participant-row-${participantIndex}`}>
          {teams.map(({ team, teamSequence }) => {
            const stats = calculateActivityStats(team.chat);

            return (
              <article
                key={team.team_id ?? `${participantLabel}-team-${teamSequence}`}
                className="crafteam-team-card"
                ref={fadeRef}
              >
                <header className="crafteam-team-card__header">
                  <div className="crafteam-team-card__title-row">
                    <h3 className="crafteam-team-card__title">
                      <span className="crafteam-team-card__title-participant">{participantLabel}</span>{' '}
                      <span className="crafteam-team-card__title-team">Team{teamSequence}</span>
                    </h3>
                  </div>
                </header>

                <p className="crafteam-team-card__topic">
                  <span className="crafteam-team-card__topic-label">Topic:</span>{' '}
                  {team.team_info?.topic ?? 'Untitled brief'}
                </p>

                <TeamStructureGraph
                  team={team}
                  ownerLabel="Me"
                  participantLabel={participantLabel}
                />

                <footer className="crafteam-team-card__stats">
                  <TeamStructureStat label="Ideas" value={stats.ideaGeneration} />
                  <TeamStructureStat label="Evaluation" value={stats.evaluation} />
                  <TeamStructureStat label="Feedback" value={stats.feedback} />
                  <TeamStructureStat label="Requests" value={stats.request} />
                </footer>
              </article>
            );
          })}
        </div>
      ))}
    </div>
  );
};
