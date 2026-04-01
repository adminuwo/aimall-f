import sys
import re

files = [
    r'f:/ab/frontend/index.html',
    r'f:/ab/frontend/about.html',
    r'f:/ab/frontend/contact.html',
    r'f:/ab/frontend/partner.html',
    r'f:/ab/frontend/a-series.html'
]

new_social_block = '''<div class=\"social-links\">
                            <a href=\"https://www.instagram.com/aimall.global/\" class=\"social-icon\" aria-label=\"Instagram\">
                                <img src=\"logos/instagram.jfif\" alt=\"Instagram\">
                            </a>
                            <a href=\"https://www.linkedin.com/in/aimall-global/\" class=\"social-icon\" aria-label=\"LinkedIn\">
                                <img src=\"logos/linkedin.jfif\" alt=\"LinkedIn\">
                            </a>
                            <a href=\"https://x.com/aimallglobal\" class=\"social-icon\" aria-label=\"X\">
                                <img src=\"logos/X.png\" alt=\"X\">
                            </a>
                            <a href=\"https://www.youtube.com/\" class=\"social-icon\" aria-label=\"YouTube\">
                                <img src=\"logos/youtube.png\" alt=\"YouTube\">
                            </a>
                            <a href=\"https://www.facebook.com/aimallglobal/\" class=\"social-icon\" aria-label=\"Facebook\">
                                <img src=\"logos/facebook.jpg\" alt=\"Facebook\">
                            </a>
                            <a href=\"https://api.whatsapp.com/send?phone=918359890909\" class=\"social-icon\" aria-label=\"WhatsApp\">
                                <img src=\"logos/whatsappp.jpg\" alt=\"WhatsApp\">
                            </a>
                            <a href=\"mailto:admin@uwo24.com\" class=\"social-icon\" aria-label=\"Gmail\">
                                <img src=\"logos/gmail.png\" alt=\"Gmail\">
                            </a>
                            <a href=\"https://www.threads.net/@aimallglobal\" class=\"social-icon\" aria-label=\"Threads\">
                                <img src=\"logos/threads.jfif\" alt=\"Threads\">
                            </a>
                        </div>'''

for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Regex to match the social-links div completely
        # It finds <div class="social-links"> and everything inside until the closing </div> that matches its indentation
        pattern = re.compile(r'<div class=\"social-links\">.*?</div>\s*</div>', re.DOTALL)
        
        # We need to make sure we don't accidentally eat up the parent div's closing tag
        pattern = re.compile(r'<div class=\"social-links\">[\s\S]*?(?=\s*</div>\s*</div>)', re.DOTALL)
        
        if pattern.search(content):
            content = pattern.sub(new_social_block, content)
            
            with open(f, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f'Updated {f}')
        else:
            print(f'No match found in {f}')
    except Exception as e:
        print(f'Error processing {f}: {e}')
