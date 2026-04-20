#!/usr/bin/env python3
import json
import re
from collections import Counter

def verify_translation_results():
    # Load the translated file
    with open('/Users/imhyeonseung/Desktop/GIT/Hyunseung-Lim.github.io/src/Data/structured_teams_en.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    korean_pattern = re.compile(r'[가-힣]+')
    korean_content = []
    korean_words = []

    def find_korean_content(obj, path=""):
        if isinstance(obj, dict):
            for key, value in obj.items():
                current_path = f"{path}.{key}" if path else key
                find_korean_content(value, current_path)
        elif isinstance(obj, list):
            for i, item in enumerate(obj):
                current_path = f"{path}[{i}]"
                find_korean_content(item, current_path)
        elif isinstance(obj, str):
            korean_matches = korean_pattern.findall(obj)
            if korean_matches:
                korean_content.append({
                    'path': path,
                    'content': obj[:200] + '...' if len(obj) > 200 else obj,
                    'korean_words': korean_matches
                })
                korean_words.extend(korean_matches)

    find_korean_content(data)

    # Analyze the results
    print("=" * 60)
    print("TRANSLATION VERIFICATION REPORT")
    print("=" * 60)

    print(f"\n📊 SUMMARY:")
    print(f"   • Total sections with Korean content: {len(korean_content)}")
    print(f"   • Total Korean words found: {len(korean_words)}")
    print(f"   • Unique Korean words: {len(set(korean_words))}")

    # Count by section type
    section_types = Counter()
    for item in korean_content:
        if 'team_info' in item['path']:
            section_types['team_info'] += 1
        elif 'owner_info' in item['path']:
            section_types['owner_info'] += 1
        elif 'agents' in item['path']:
            section_types['agents'] += 1
        elif 'ideas' in item['path']:
            section_types['ideas'] += 1
        elif 'chat' in item['path']:
            section_types['chat'] += 1
        elif 'evaluations' in item['path']:
            section_types['evaluations'] += 1
        else:
            section_types['other'] += 1

    print(f"\n📂 BREAKDOWN BY SECTION TYPE:")
    for section, count in section_types.most_common():
        print(f"   • {section}: {count} sections")

    # Most common Korean words
    word_counts = Counter(korean_words)
    print(f"\n🔤 MOST COMMON REMAINING KOREAN WORDS:")
    for word, count in word_counts.most_common(20):
        print(f"   • '{word}': {count} times")

    # Sample remaining content
    print(f"\n📝 SAMPLE REMAINING KOREAN CONTENT:")
    for i, item in enumerate(korean_content[:10]):
        print(f"\n   {i+1}. Path: {item['path']}")
        print(f"      Content: {item['content']}")
        print(f"      Korean words: {', '.join(item['korean_words'])}")

    # Check if there are specific patterns that need attention
    print(f"\n🎯 RECOMMENDATIONS:")

    if section_types.get('ideas', 0) > 0:
        print(f"   • {section_types['ideas']} idea sections still contain Korean - focus on object/function translations")

    if section_types.get('chat', 0) > 0:
        print(f"   • {section_types['chat']} chat sections still contain Korean - focus on message translations")

    if section_types.get('agents', 0) > 0:
        print(f"   • {section_types['agents']} agent profile sections still contain Korean")

    if section_types.get('evaluations', 0) > 0:
        print(f"   • {section_types['evaluations']} evaluation sections still contain Korean")

    # Calculate translation progress
    original_korean_count = 3855  # From first analysis
    remaining_korean_count = len(korean_content)
    progress_percentage = ((original_korean_count - remaining_korean_count) / original_korean_count) * 100

    print(f"\n🚀 TRANSLATION PROGRESS:")
    print(f"   • Started with: {original_korean_count} Korean sections")
    print(f"   • Remaining: {remaining_korean_count} Korean sections")
    print(f"   • Translated: {original_korean_count - remaining_korean_count} sections")
    print(f"   • Progress: {progress_percentage:.1f}% complete")

    print("\n" + "=" * 60)

if __name__ == "__main__":
    verify_translation_results()