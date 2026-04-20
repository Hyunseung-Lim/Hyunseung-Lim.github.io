#!/usr/bin/env python3
import json
import re
import ast

# Comprehensive translation mappings
translations = {
    # Names
    "김사장": "CEO Kim",
    "김태완": "Taewan Kim",
    "백선우": "Sunwoo Baek",
    "남호연": "Hoyeon Nam",
    "송유택": "Yutaek Song",
    "김진수": "Jinsoo Kim",
    "이수진": "Sujin Lee",
    "박민호": "Minho Park",
    "최영희": "Younghee Choi",
    "정현우": "Hyunwoo Jung",
    "장은미": "Eunmi Jang",
    "윤서연": "Seoyeon Yoon",
    "신동현": "Donghyun Shin",

    # Topics and titles
    "미래의 wearable AI device 아이디에이션": "Future Wearable AI Device Ideation",
    "자율주행 자동차를 바탕으로 하는 새로운 서비스 시나리오 발굴": "Discovering New Service Scenarios Based on Autonomous Vehicles",
    "TV 에서의 생성형 AI의 활용 방안": "Utilization of Generative AI in TV",
    "인스타그램 콘텐츠 피드의 디자인을 혁신화하는 방안": "Innovative Design Approaches for Instagram Content Feed",
    "광고주를 위한 대시보드 구성": "Dashboard Configuration for Advertisers",
    "교육 시스템 혁신을 위한 감정 인식 기술 활용": "Utilizing Emotion Recognition Technology for Educational System Innovation",

    # Team names
    "Apple Creative Team": "Apple Creative Team",
    "인스타그램 콘텐츠 피드 디자인 혁신 팀": "Instagram Content Feed Design Innovation Team",
    "광고 대시보드 개발 팀": "Advertising Dashboard Development Team",

    # Professional titles
    "경영전문가 (MBA)": "Business Specialist (MBA)",
    "마케팅 전문가": "Marketing Specialist",
    "디자이너": "Designer",
    "시스템 엔지니어": "Systems Engineer",
    "프로덕트 매니저": "Product Manager",
    "소프트웨어 엔지니어": "Software Engineer",
    "데이터 분석가": "Data Analyst",
    "UX/UI 디자이너": "UX/UI Designer",
    "비즈니스 분석가": "Business Analyst",

    # Skills
    "경영전략": "Business Strategy",
    "시각화 및 인포그래픽": "Visualization and Infographics",
    "고객개발": "Customer Development",
    "신사업 기획": "New Business Planning",
    "팀 리더십": "Team Leadership",
    "문제 해결 분석": "Problem-solving Analysis",
    "디자인 씽킹 방법론": "Design Thinking Methodology",
    "사용자 리서치": "User Research",
    "기획 및 전략 수립": "Planning and Strategy Development",
    "커뮤니케이션": "Communication",
    "프로젝트 관리": "Project Management",

    # Personality traits
    "근면성실하며, 빈틈이 없는 성격": "Diligent and meticulous personality",
    "예민하지만, 섬세하고, 작은것에 민감함.": "Sensitive but detail-oriented, attentive to small details",
    "차분하고, 섬세함. 말하기보다 듣기를 좋아하는 성격.": "Calm and delicate. Prefers listening to speaking",
    "긍정적, 예리함": "Positive and sharp",
    "체계적이고 분석적으로, 의미있는 아이디어를 분별해낼 수 있음.": "Systematic and analytical, able to discern meaningful ideas",
    "팀워크를 중시하는 성격": "Personality that values teamwork",
    "논리적이고 이성적.": "Logical and rational",

    # Work styles
    "디테일에 예민하며, 놓치는 것이 없는 것을 좋아함. 정밀하게 사안을 분석하고, 이를 바탕으로 결론을 도출함.": "Sensitive to details and likes to miss nothing. Analyzes issues precisely and draws conclusions based on this",
    "사람들이 말로 하는 아이디어를 시각화해서 구체화해주고, 이를 바탕으로 더 원활한 업무가 진행될 수 있도록 함.": "Visualizes and materializes ideas that people express verbally, enabling smoother work progress",
    "데이터 기반의 의사결정, 논리적인 의사결정. 커뮤니케이션을 좋아하며, 팀원들간의 align을 중요시함.": "Data-driven decision making, logical decision making. Enjoys communication and values alignment among team members",
    "논리적이고 분석적으로 아이디어를 평가하고 피드백을 요청함.": "Evaluates ideas logically and analytically and requests feedback",
    "체계적, 분석적, 팀워크 중심적": "Systematic, analytical, teamwork-focused",

    # Preferences
    "목표 지향적 업무 방식": "Goal-oriented work approach",
    "섬세함, 정밀한 분석": "Delicacy, precise analysis",
    "예술, 음악, 창조적 성격의 업무들.": "Arts, music, creative work",
    "최신 기술 트렌드 동향, 최신 논문 follow-up": "Latest technology trends, latest research paper follow-up",
    "군더더기 없이 깔끔한 보고": "Clean reporting without fluff",
    "협업 중심적인 환경, proactive한 분위기": "Collaboration-centered environment, proactive atmosphere",

    # Dislikes
    "고집불통인 사람": "Stubborn people",
    "대충 넘어가는 거, 빠른 업무 전개, 린 붙는거 혐오": "Hates rushing through things, rapid work development, and being clingy",
    "말로만 디자인하는 사람. 입자이너": "People who only design with words. Lip designers",
    "감정적 의사결정, 비 이성적인 판단. 근거없는 주장": "Emotional decision making, irrational judgment. Baseless claims",
    "지나치게 복잡한 결과물, 자아중심적인 주장": "Overly complex deliverables, egocentric claims",
    "비효율적인 프로세스, 비효율적인 커뮤닙이션": "Inefficient processes, inefficient communication",

    # Basic attributes
    "남자": "Male",
    "여자": "Female",
    "정의하지 않음": "Undefined",
    "박사": "Doctoral Degree",
    "석사": "Master's Degree",
    "학사": "Bachelor's Degree",
    "한국": "Korea",

    # Roles
    "피드백하기": "Provide Feedback",
    "요청하기": "Make Requests",
    "아이디어 평가하기": "Evaluate Ideas",
    "아이디어 생성하기": "Generate Ideas",

    # Ideas and objects
    "AI 기반 감정 인식 스마트 팔찌": "AI-based Emotion Recognition Smart Bracelet",
    "AI 기반 건강 관리 스마트 반지": "AI-based Health Management Smart Ring",
    "감정 인식 웨어러블 디바이스": "Emotion Recognition Wearable Device",
    "스마트 헬스케어 링": "Smart Healthcare Ring",
    "지능형 건강 모니터링 반지": "Intelligent Health Monitoring Ring",
    "개인 맞춤형 AI 건강 코치 웨어러블": "Personalized AI Health Coach Wearable",
    "AI 기반 감정 관리 웨어러블": "AI-based Emotion Management Wearable",
    "스마트 스트레스 관리 밴드": "Smart Stress Management Band",
    "웨어러블 AI 헬스 트래커": "Wearable AI Health Tracker",
    "지능형 수면 최적화 링": "Intelligent Sleep Optimization Ring",

    # Functions and descriptions
    "실시간으로 사용자의 감정 상태를 분석하고 피드백을 제공": "Analyze user's emotional state in real-time and provide feedback",
    "일상적인 건강 모니터링과 스트레스 관리": "Daily health monitoring and stress management",
    "사용자의 건강 상태를 지속적으로 모니터링하며 개인 맞춤형 건강 관리 서비스 제공": "Continuously monitor user's health status and provide personalized health management services",
    "개인화된 건강 데이터를 바탕으로 맞춤형 건강 조언과 운동 프로그램을 제공": "Provide personalized health advice and exercise programs based on personal health data",

    # System messages and common phrases
    "새로운 아이디어를 생성했습니다.": "A new idea has been generated.",
    "아이디어를 평가했습니다.": "An idea has been evaluated.",
    "피드백을 요청했습니다.": "Feedback has been requested.",
    "기존 아이디어를 업데이트하여 새로운 아이디어를 생성했습니다.": "Updated existing idea to generate a new idea.",

    # Evaluation criteria and responses
    "그렇다": "Yes",
    "그렇지 않다": "No",
    "전혀 그렇지 않다": "Not at all",
    "보통": "Average",
    "매우 그렇다": "Strongly agree",

    # Common words for complex phrases
    "사용자의": "user's",
    "실시간": "real-time",
    "모니터링": "monitoring",
    "분석": "analysis",
    "피드백": "feedback",
    "제공": "provide",
    "관리": "management",
    "인식": "recognition",
    "감정": "emotion",
    "건강": "health",
    "스트레스": "stress",
    "수면": "sleep",
    "심박수": "heart rate",
    "데이터": "data",
    "알고리즘": "algorithm",
    "센서": "sensor",
    "기능": "function",
    "맞춤형": "customized",
    "개인화": "personalization",
    "지능형": "intelligent",
}

def translate_text(text):
    """Translate Korean text using the translation mapping."""
    if not isinstance(text, str):
        return text

    korean_pattern = re.compile(r'[가-힣]')
    if not korean_pattern.search(text):
        return text

    result = text

    # Apply translations in order of length (longer first for better matching)
    for korean, english in sorted(translations.items(), key=len, reverse=True):
        if korean in result:
            result = result.replace(korean, english)

    return result

def translate_json_string(json_str):
    """Parse JSON string, translate content, and return as JSON string."""
    try:
        # Try to parse as JSON
        data = json.loads(json_str)
        translated_data = translate_recursively(data)
        return json.dumps(translated_data, ensure_ascii=False, separators=(',', ':'))
    except (json.JSONDecodeError, ValueError):
        try:
            # Try to parse with ast.literal_eval for Python-like structures
            data = ast.literal_eval(json_str)
            translated_data = translate_recursively(data)
            return json.dumps(translated_data, ensure_ascii=False, separators=(',', ':'))
        except (ValueError, SyntaxError):
            # If parsing fails, just translate as regular text
            return translate_text(json_str)

def translate_recursively(data):
    """Recursively translate content in data structures."""
    if isinstance(data, dict):
        result = {}
        for key, value in data.items():
            # Translate both keys and values
            translated_key = translate_text(key)
            if isinstance(value, str) and (value.startswith('{') or value.startswith('[')):
                # This might be a JSON string
                result[translated_key] = translate_json_string(value)
            else:
                result[translated_key] = translate_recursively(value)
        return result
    elif isinstance(data, list):
        return [translate_recursively(item) for item in data]
    elif isinstance(data, str):
        if data.startswith('{') or data.startswith('['):
            return translate_json_string(data)
        else:
            return translate_text(data)
    else:
        return data

def main():
    # Load the English file
    with open('/Users/imhyeonseung/Desktop/GIT/Hyunseung-Lim.github.io/src/Data/structured_teams_en.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    print("Starting advanced translation process...")

    # Create backup with timestamp
    import datetime
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = f'/Users/imhyeonseung/Desktop/GIT/Hyunseung-Lim.github.io/src/Data/structured_teams_en_backup_{timestamp}.json'

    with open(backup_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Backup created: {backup_path}")

    # Translate the content
    translated_data = translate_recursively(data)

    # Save the translated version
    with open('/Users/imhyeonseung/Desktop/GIT/Hyunseung-Lim.github.io/src/Data/structured_teams_en.json', 'w', encoding='utf-8') as f:
        json.dump(translated_data, f, ensure_ascii=False, indent=2)

    print("Advanced translation completed and saved.")

    # Check for remaining Korean content
    korean_pattern = re.compile(r'[가-힣]')
    remaining_korean = []

    def find_remaining_korean(obj, path=""):
        if isinstance(obj, dict):
            for key, value in obj.items():
                current_path = f"{path}.{key}" if path else key
                find_remaining_korean(value, current_path)
        elif isinstance(obj, list):
            for i, item in enumerate(obj):
                current_path = f"{path}[{i}]"
                find_remaining_korean(item, current_path)
        elif isinstance(obj, str):
            if korean_pattern.search(obj):
                remaining_korean.append({
                    'path': path,
                    'content': obj[:150] + '...' if len(obj) > 150 else obj
                })

    find_remaining_korean(translated_data)

    print(f"\nRemaining Korean text sections after advanced translation: {len(remaining_korean)}")

    if remaining_korean:
        print("\nFirst 15 remaining sections:")
        for item in remaining_korean[:15]:
            print(f"Path: {item['path']}")
            print(f"Content: {item['content']}")
            print("-" * 40)
    else:
        print("🎉 All Korean content has been successfully translated!")

if __name__ == "__main__":
    main()