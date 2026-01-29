#!/usr/bin/env python3
"""批量替换路径引用"""
import os
import re
from pathlib import Path

# 路径映射表
PATH_MAPPINGS = [
    (r'~/.clawdbot/moltbot\.json', '~/.panda/panda.json'),
    (r'~/.moltbot/moltbot\.json', '~/.panda/panda.json'),
    (r'~/.clawdbot/clawdbot\.json', '~/.panda/panda.json'),
    (r'~/.clawdbot-dev', '~/.panda-dev'),
    (r'~/.moltbot-dev', '~/.panda-dev'),
    (r'~/.clawdbot-', '~/.panda-'),
    (r'~/.moltbot-', '~/.panda-'),
    (r'~/.clawdbot', '~/.panda'),
    (r'~/.moltbot', '~/.panda'),
    (r'Moltbot status', 'Pandabot status'),
]

def process_file(file_path):
    """处理单个文件"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # 执行替换
        for old_path, new_path in PATH_MAPPINGS:
            content = re.sub(old_path, new_path, content)
        
        # 如果有变化则写回文件
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ {file_path}")
            return 1
        return 0
    except Exception as e:
        print(f"✗ {file_path}: {e}")
        return 0

def main():
    base_dir = Path.cwd()
    dirs_to_process = ['src', 'test']
    extensions = ['.ts', '.js']
    
    total_files = 0
    updated_files = 0
    
    print("开始替换路径引用...")
    
    for dir_name in dirs_to_process:
        dir_path = base_dir / dir_name
        if not dir_path.exists():
            continue
            
        for ext in extensions:
            for file_path in dir_path.rglob(f'*{ext}'):
                if file_path.is_file():
                    total_files += 1
                    updated_files += process_file(file_path)
    
    print(f"\n完成! 共处理 {total_files} 个文件, 更新了 {updated_files} 个文件")

if __name__ == '__main__':
    main()
