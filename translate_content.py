#!/usr/bin/env python3
import json
import re
import copy

# Translation mappings
translations = {
    # Professions
    "경영전문가 (MBA)": "Business Specialist (MBA)",
    "마케팅 전문가": "Marketing Specialist",
    "디자이너": "Designer",
    "시스템 엔지니어": "Systems Engineer",
    "프로덕트 매니저": "Product Manager",
    "소프트웨어 엔지니어": "Software Engineer",
    "데이터 분석가": "Data Analyst",
    "UX/UI 디자이너": "UX/UI Designer",

    # Skills
    "경영전략": "Business Strategy",
    "시각화 및 인포그래픽": "Visualization and Infographics",
    "고객개발": "Customer Development",
    "신사업 기획": "New Business Planning",
    "팀 리더십": "Team Leadership",

    # Personality traits
    "근면성실하며, 빈틈이 없는 성격": "Diligent and meticulous personality",
    "예민하지만, 섬세하고, 작은것에 민감함.": "Sensitive but detail-oriented, attentive to small details.",
    "차분하고, 섬세함. 말하기보다 듣기를 좋아하는 성격.": "Calm and delicate. Prefers listening to speaking.",
    "긍정적, 예리함": "Positive and sharp",
    "체계적이고 분석적으로, 의미있는 아이디어를 분별해낼 수 있음.": "Systematic and analytical, able to discern meaningful ideas.",
    "팀워크를 중시하는 성격": "Personality that values teamwork",

    # Work styles
    "디테일에 예민하며, 놓치는 것이 없는 것을 좋아함. 정밀하게 사안을 분석하고, 이를 바탕으로 결론을 도출함.": "Sensitive to details and likes to miss nothing. Analyzes issues precisely and draws conclusions based on this.",
    "사람들이 말로 하는 아이디어를 시각화해서 구체화해주고, 이를 바탕으로 더 원활한 업무가 진행될 수 있도록 함.": "Visualizes and materializes ideas that people express verbally, enabling smoother work progress based on this.",
    "데이터 기반의 의사결정, 논리적인 의사결정. 커뮤니케이션을 좋아하며, 팀원들간의 align을 중요시함.": "Data-driven decision making, logical decision making. Enjoys communication and values alignment among team members.",
    "논리적이고 분석적으로 아이디어를 평가하고 피드백을 요청함.": "Evaluates ideas logically and analytically and requests feedback.",
    "체계적, 분석적, 팀워크 중심적": "Systematic, analytical, teamwork-focused",

    # Preferences
    "목표 지향적 업무 방식": "Goal-oriented work approach",
    "섬세함, 정밀한 분석": "Delicacy, precise analysis",
    "예술, 음악, 창조적 성격의 업무들.": "Arts, music, creative nature of work.",
    "최신 기술 트렌드 동향, 최신 논문 follow-up": "Latest technology trends, latest research paper follow-up",
    "군더더기 없이 깔끔한 보고": "Clean reporting without fluff",
    "협업 중심적인 환경, proactive한 분위기": "Collaboration-centered environment, proactive atmosphere",

    # Dislikes
    "고집불통인 사람": "Stubborn people",
    "대충 넘어가는 거, 빠른 업무 전개, 린 붙는거 혐오": "Hates rushing through things, rapid work development, and being clingy",
    "말로만 디자인하는 사람. 입자이너": "People who only design with words. Lip designers",
    "감정적 의사결정, 비 이성적인 판단. 근거없는 주장": "Emotional decision making, irrational judgment. Baseless claims",
    "지나치게 복잡한 결과물, 자아중심적인 주장": "Overly complex deliverables, egocentric claims",
    "비효율적인 프로세스, 비효율적인 커뮤닠에ㅣ션": "Inefficient processes, inefficient communication",

    # Genders
    "남자": "Male",
    "여자": "Female",
    "정의하지 않음": "Undefined",

    # Education levels
    "박사": "Doctoral Degree",
    "석사": "Master's Degree",
    "학사": "Bachelor's Degree",

    # Nationalities
    "한국": "Korea",

    # Roles
    "피드백하기": "Provide Feedback",
    "요청하기": "Make Requests",
    "아이디어 평가하기": "Evaluate Ideas",
    "아이디어 생성하기": "Generate Ideas",

    # Ideas - Objects
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

    # Common Korean words/phrases
    "사용자": "user",
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
    "기술": "technology",
    "시스템": "system",
    "플랫폼": "platform",
    "서비스": "service",
    "솔루션": "solution",
    "개발": "development",
    "설계": "design",
    "구현": "implementation",
    "최적화": "optimization",
    "개선": "improvement",
    "향상": "enhancement",
    "효율성": "efficiency",
    "정확성": "accuracy",
    "안전성": "safety",
    "보안": "security",
    "프라이버시": "privacy",
    "개인화": "personalization",
    "맞춤형": "customized",
    "지능형": "intelligent",
    "자동": "automatic",
    "수동": "manual",
    "통합": "integration",
    "연동": "linkage",
    "호환": "compatibility",
    "확장": "expansion",
    "업그레이드": "upgrade",
    "업데이트": "update",
    "버전": "version",
    "기본": "basic",
    "고급": "advanced",
    "전문": "professional",
    "표준": "standard",
    "맞춤": "custom"
}

def translate_korean_text(text):
    """Translate Korean text to English using our translation mapping."""
    if not isinstance(text, str):
        return text

    # Check if text contains Korean characters
    korean_pattern = re.compile(r'[가-힣]')
    if not korean_pattern.search(text):
        return text

    translated = text

    # Apply direct translations
    for korean, english in translations.items():
        if korean in translated:
            translated = translated.replace(korean, english)

    # If still contains Korean after direct translation, return original for manual review
    if korean_pattern.search(translated):
        return text

    return translated

def translate_json_recursively(data):
    """Recursively translate Korean content in JSON structure."""
    if isinstance(data, dict):
        return {key: translate_json_recursively(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [translate_json_recursively(item) for item in data]
    elif isinstance(data, str):
        return translate_korean_text(data)
    else:
        return data

def main():
    # Load the English file that contains Korean content
    with open('/Users/imhyeonseung/Desktop/GIT/Hyunseung-Lim.github.io/src/Data/structured_teams_en.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    print("Starting translation process...")

    # Create a backup
    with open('/Users/imhyeonseung/Desktop/GIT/Hyunseung-Lim.github.io/src/Data/structured_teams_en_backup.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print("Backup created...")

    # Translate the content
    translated_data = translate_json_recursively(data)

    # Save the translated version
    with open('/Users/imhyeonseung/Desktop/GIT/Hyunseung-Lim.github.io/src/Data/structured_teams_en.json', 'w', encoding='utf-8') as f:
        json.dump(translated_data, f, ensure_ascii=False, indent=2)

    print("Translation completed and saved.")

    # Check for remaining Korean content
    korean_pattern = re.compile(r'[가-힣]')
    remaining_korean = []

    def find_remaining_korean(data, path=""):
        if isinstance(data, dict):
            for key, value in data.items():
                find_remaining_korean(value, f"{path}.{key}" if path else key)
        elif isinstance(data, list):
            for i, item in enumerate(data):
                find_remaining_korean(item, f"{path}[{i}]")
        elif isinstance(data, str) and korean_pattern.search(data):
            remaining_korean.append({'path': path, 'content': data[:100]})

    find_remaining_korean(translated_data)

    print(f"\nRemaining Korean text sections: {len(remaining_korean)}")
    for item in remaining_korean[:10]:
        print(f"Path: {item['path']}")
        print(f"Content: {item['content']}")
        print("-" * 30)

if __name__ == "__main__":
    main()