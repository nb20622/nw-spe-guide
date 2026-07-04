#!/usr/bin/env python3
"""HTMLタグ整合チェック: python3 _dev/check.py <file.html> [...]"""
import sys
from html.parser import HTMLParser

VOID = {'meta','link','br','hr','img','input','wbr','source','area','base',
        'col','embed','track','param'}

class P(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack, self.errs = [], []
    def handle_starttag(self, t, a):
        if t not in VOID:
            self.stack.append((t, self.getpos()))
    def handle_endtag(self, t):
        if t in VOID:
            return
        if self.stack and self.stack[-1][0] == t:
            self.stack.pop()
        else:
            self.errs.append(f"mismatch </{t}> at {self.getpos()}")

rc = 0
for path in sys.argv[1:]:
    p = P()
    p.feed(open(path, encoding='utf-8').read())
    unclosed = [(t, pos) for t, pos in p.stack if t not in ('html', 'body')]
    if p.errs or unclosed:
        rc = 1
        print(f"NG {path}")
        for e in p.errs[:10]:
            print("  ", e)
        for t, pos in unclosed[:10]:
            print(f"   unclosed <{t}> from {pos}")
    else:
        print(f"OK {path}")
sys.exit(rc)
