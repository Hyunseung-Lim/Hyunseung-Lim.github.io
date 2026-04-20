#!/usr/bin/env python3
import json
import re

def examine_remaining_korean():
    # Load the current translated file
    with open('/Users/imhyeonseung/Desktop/GIT/Hyunseung-Lim.github.io/src/Data/structured_teams_en.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    korean_pattern = re.compile(r'[가-힣]+')
    korean_words = set()

    def extract_korean_words(obj):
        if isinstance(obj, dict):
            for key, value in obj.items():
                extract_korean_words(value)
        elif isinstance(obj, list):
            for item in obj:
                extract_korean_words(item)
        elif isinstance(obj, str):
            # Find all Korean words
            matches = korean_pattern.findall(obj)
            for match in matches:
                korean_words.add(match)

    extract_korean_words(data)

    print(f"Unique Korean words found: {len(korean_words)}")
    print("\nTop 50 most common Korean words that need translation:")

    # Sort by frequency and length for better translation planning
    sorted_words = sorted(korean_words, key=lambda x: (len(x), x), reverse=True)

    for word in sorted_words[:50]:
        print(f"'{word}'")

if __name__ == "__main__":
    examine_remaining_korean()