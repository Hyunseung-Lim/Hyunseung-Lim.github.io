#!/usr/bin/env python3
import json
import re

# Extended comprehensive translation mappings
translations = {
    # Keep all previous translations and add new ones

    # Basic Korean words and particles
    "나": "I",
    "를": "",  # Object particle, remove in English
    "을": "",  # Object particle, remove in English
    "이": "",  # Subject particle, remove in English
    "가": "",  # Subject particle, remove in English
    "의": "of",
    "에서": "in",
    "에게": "to",
    "로": "with",
    "으로": "with",
    "와": "and",
    "과": "and",
    "도": "also",
    "만": "only",
    "부터": "from",
    "까지": "to",
    "처럼": "like",
    "같은": "like",
    "같이": "together",
    "함께": "together",

    # Complex compound words
    "역사적컨텐츠라이브러리": "Historical Content Library",
    "아이디에이션해주세요": "Please do ideation",
    "아이데이션해야합니다": "We need to do ideation",
    "브레인스토밍해볼까요": "Shall we brainstorm",
    "보안및프라이버시모듈": "Security and Privacy Module",
    "홀로그램디스플레이": "Hologram Display",
    "커스터마이제이션을": "customization",
    "커스터마이제이션": "customization",
    "커스터마이징하여": "by customizing",
    "커스터마이징하고": "customizing and",
    "커스터마이즈하여": "by customizing",
    "커스터마이즈하며": "while customizing",
    "커스터마이즈하고": "customizing and",
    "중간평가자급에게만": "only to intermediate evaluators",
    "작성해드리겠습니다": "I will write it for you",
    "오디오가이드시스템": "Audio Guide System",
    "안좋아지는거같은데": "it seems to be getting worse",
    "아이디에이션에서도": "even in ideation",
    "아이디어라기보다는": "rather than an idea",
    "시뮬레이션해볼까요": "shall we simulate",
    "시뮬레이션해보면": "if we simulate",
    "시뮬레이션해보는": "simulating",
    "시뮬레이션해보고": "simulate and",
    "시뮬레이션하면서": "while simulating",
    "사용자인터페이스의": "user interface",
    "사용자인터페이스와": "user interface and",
    "브레인스토밍해보면": "if we brainstorm",
    "발전시켜보겠습니다": "I will develop it",
    "마이크로매니징하는": "micromanaging",
    "고도화시키는데에는": "to advance",
    "게이미피케이션같은": "like gamification",
    "개인정보보호시스템": "Personal Information Protection System",
    "활성화시킬건지에": "how to activate",
    "프레임워크니까요": "it's a framework",
    "파악해보겠습니다": "I will figure it out",
    "크리에이터들에게": "to creators",
    "크리에이터들과의": "with creators",
    "친화적이어야겠죠": "should be user-friendly",
    "추가해보겠습니다": "I will add it",
    "진행해주시겠어요": "would you proceed",
    "준비해보겠습니다": "I will prepare",
    "제시하는것이지만": "although presenting",
    "임팩트있을거구요": "it will be impactful",
    "인터페이스디자인": "Interface Design",
    "어플리케이션과의": "with application",
    "아이디이에이션을": "ideation",
    "아이디에이션으로": "with ideation",
    "아이디에이션에서": "in ideation",
    "스토리라인으로는": "in terms of storyline",
    "스토리라이브러리": "Story Library",

    # Common verbs and adjectives
    "하는": "doing",
    "되는": "becoming",
    "있는": "existing",
    "없는": "not existing",
    "좋은": "good",
    "나쁜": "bad",
    "새로운": "new",
    "오래된": "old",
    "큰": "big",
    "작은": "small",
    "많은": "many",
    "적은": "few",
    "빠른": "fast",
    "느린": "slow",
    "쉬운": "easy",
    "어려운": "difficult",
    "높은": "high",
    "낮은": "low",
    "강한": "strong",
    "약한": "weak",
    "밝은": "bright",
    "어두운": "dark",

    # Technical terms
    "시스템": "system",
    "플랫폼": "platform",
    "서비스": "service",
    "솔루션": "solution",
    "기능": "function",
    "특징": "feature",
    "성능": "performance",
    "품질": "quality",
    "효율": "efficiency",
    "보안": "security",
    "안전": "safety",
    "편의": "convenience",
    "사용성": "usability",
    "접근성": "accessibility",
    "호환성": "compatibility",
    "안정성": "stability",
    "신뢰성": "reliability",
    "확장성": "scalability",
    "유연성": "flexibility",

    # Business terms
    "고객": "customer",
    "사용자": "user",
    "소비자": "consumer",
    "클라이언트": "client",
    "파트너": "partner",
    "공급업체": "supplier",
    "경쟁사": "competitor",
    "시장": "market",
    "산업": "industry",
    "브랜드": "brand",
    "제품": "product",
    "서비스": "service",
    "가격": "price",
    "비용": "cost",
    "수익": "revenue",
    "이익": "profit",
    "손실": "loss",
    "투자": "investment",
    "자금": "funding",

    # Process terms
    "개발": "development",
    "설계": "design",
    "구현": "implementation",
    "테스트": "testing",
    "배포": "deployment",
    "운영": "operation",
    "유지보수": "maintenance",
    "업그레이드": "upgrade",
    "업데이트": "update",
    "최적화": "optimization",
    "개선": "improvement",
    "혁신": "innovation",
    "변화": "change",
    "발전": "development",
    "성장": "growth",
    "확장": "expansion",

    # Time and measurement
    "시간": "time",
    "기간": "period",
    "순간": "moment",
    "현재": "present",
    "과거": "past",
    "미래": "future",
    "일일": "daily",
    "주간": "weekly",
    "월간": "monthly",
    "연간": "yearly",
    "실시간": "real-time",
    "즉시": "immediate",
    "신속": "quick",
    "지연": "delay",

    # Quality and evaluation
    "우수한": "excellent",
    "훌륭한": "great",
    "좋은": "good",
    "평균적인": "average",
    "나쁜": "poor",
    "최고": "best",
    "최악": "worst",
    "만족": "satisfaction",
    "불만": "dissatisfaction",
    "성공": "success",
    "실패": "failure",
    "효과": "effect",
    "결과": "result",
    "성과": "performance",
    "목표": "goal",
    "목적": "purpose",

    # Actions and operations
    "생성": "generation",
    "제작": "creation",
    "구축": "construction",
    "건설": "building",
    "제공": "provision",
    "지원": "support",
    "도움": "help",
    "지시": "instruction",
    "명령": "command",
    "요청": "request",
    "응답": "response",
    "답변": "answer",
    "질문": "question",
    "문의": "inquiry",

    # Common phrases that appear in evaluations
    "팀원에게 적절한 역할이 부여되었다": "Appropriate roles were assigned to team members",
    "이 팀원은 부여된 역할을 잘 수행하였다": "This team member performed their assigned role well",
    "이 팀원은 맡은 역할에 가장 적합한 페르소나를 지니고 있습니다": "This team member has the most suitable persona for their assigned role",
    "이 팀원은 자신의 페르소나에 어울리게 행동했다": "This team member acted according to their persona",
    "이 팀원은 팀 성과에 기여했다": "This team member contributed to team performance",
    "이 팀원은 팀에 필요한 존재이다": "This team member is necessary for the team",
    "팀원에 대한 한줄평을 작성해주세요": "Please write a one-line review of the team member",

    # Survey questions
    "해당 팀의 규모 (인원 수) 는 적절했나요": "Was the team size (number of members) appropriate",
    "그렇게 생각한 이유는 무엇인가요": "What is the reason you think so",
    "해당 팀의 구조 (조직도)는 적절히 설계되었나요": "Was the team structure (organizational chart) appropriately designed",
    "각 팀원들이 해당 조직도에 부합하여 업무를 수행했다고 생각하나요": "Do you think each team member performed their work according to the organizational chart",
    "그 이유는 무엇인가요": "What is the reason",

    # Remove "나" when it appears in node positions as it's a Korean pronoun
    '"나"': '"Me"',
}

def translate_text_comprehensive(text):
    """Comprehensive translation with better handling of Korean text."""
    if not isinstance(text, str):
        return text

    korean_pattern = re.compile(r'[가-힣]')
    if not korean_pattern.search(text):
        return text

    result = text

    # Apply translations in order of length (longer phrases first)
    for korean, english in sorted(translations.items(), key=len, reverse=True):
        if korean in result and korean.strip():  # Only replace non-empty Korean text
            result = result.replace(korean, english)

    # Clean up double spaces and extra punctuation
    result = re.sub(r'\s+', ' ', result)
    result = result.strip()

    return result

def translate_json_string_comprehensive(json_str):
    """Enhanced JSON string translation."""
    try:
        data = json.loads(json_str)
        translated_data = translate_recursively_comprehensive(data)
        return json.dumps(translated_data, ensure_ascii=False, separators=(',', ':'))
    except (json.JSONDecodeError, ValueError):
        return translate_text_comprehensive(json_str)

def translate_recursively_comprehensive(data):
    """Enhanced recursive translation."""
    if isinstance(data, dict):
        result = {}
        for key, value in data.items():
            translated_key = translate_text_comprehensive(key)
            if isinstance(value, str) and (value.strip().startswith('{') or value.strip().startswith('[')):
                result[translated_key] = translate_json_string_comprehensive(value)
            else:
                result[translated_key] = translate_recursively_comprehensive(value)
        return result
    elif isinstance(data, list):
        return [translate_recursively_comprehensive(item) for item in data]
    elif isinstance(data, str):
        if data.strip().startswith('{') or data.strip().startswith('['):
            return translate_json_string_comprehensive(data)
        else:
            return translate_text_comprehensive(data)
    else:
        return data

def main():
    # Load the current file
    with open('/Users/imhyeonseung/Desktop/GIT/Hyunseung-Lim.github.io/src/Data/structured_teams_en.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    print("Starting final comprehensive translation...")

    # Create another backup
    import datetime
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = f'/Users/imhyeonseung/Desktop/GIT/Hyunseung-Lim.github.io/src/Data/structured_teams_en_final_backup_{timestamp}.json'

    with open(backup_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Final backup created: {backup_path}")

    # Apply comprehensive translation
    translated_data = translate_recursively_comprehensive(data)

    # Save the result
    with open('/Users/imhyeonseung/Desktop/GIT/Hyunseung-Lim.github.io/src/Data/structured_teams_en.json', 'w', encoding='utf-8') as f:
        json.dump(translated_data, f, ensure_ascii=False, indent=2)

    print("Final comprehensive translation completed.")

    # Final check for Korean content
    korean_pattern = re.compile(r'[가-힣]')
    remaining_count = 0

    def count_korean(obj):
        nonlocal remaining_count
        if isinstance(obj, dict):
            for value in obj.values():
                count_korean(value)
        elif isinstance(obj, list):
            for item in obj:
                count_korean(item)
        elif isinstance(obj, str):
            if korean_pattern.search(obj):
                remaining_count += 1

    count_korean(translated_data)

    print(f"\n🎯 Final result: {remaining_count} sections still contain Korean text")

    if remaining_count == 0:
        print("🎉 SUCCESS: All Korean content has been successfully translated to English!")
    else:
        print(f"📝 NOTE: {remaining_count} sections may contain Korean text that needs manual review")

    print("\n✅ Translation process completed successfully!")

if __name__ == "__main__":
    main()