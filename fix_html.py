"""
AVAIL — fix_html.py
Replaces hardcoded static Gantt rows in 2.html with a live container.
Also ensures all 4 pages have the required IDs for JS to target.
"""
import os, re, sys

ROOT = os.path.dirname(os.path.abspath(__file__))

# ─── 2.html: Replace hardcoded Gantt body rows with live container ─────────────
def fix_gantt_html():
    path = os.path.join(ROOT, "2.html")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    # Find the Gantt body section (everything from the scrollable wrapper to the end of rows)
    # Use a marker-based approach
    new_gantt_body = """                <!-- Live Gantt Rows — populated by JS from /api/merge-blocks -->
                <div id="gantt-blocks-container" class="flex-1 overflow-auto relative flex flex-col" style="min-height:280px">
                    <div class="flex flex-col items-center justify-center flex-1 text-on-surface-variant gap-2 pt-8">
                        <span class="material-symbols-outlined text-4xl text-primary opacity-60">timeline</span>
                        <span class="text-sm">Loading live block schedule…</span>
                    </div>
                </div>"""

    # Pattern: remove everything from the first gantt row comment to close of the scrollable div
    # The Gantt rows always start with "<!-- Scrollable Gantt Body -->" or "<!-- Row 1" or "<!-- Live Gantt"
    # and end before "<!-- Bottom Status Bar"
    pattern = r'(?:<!-- Scrollable Gantt Body -->.*?\n\s*<div class="flex-1 overflow-auto relative">\s*\n.*?|<!-- Live Gantt.*?\n.*?)<div id="gantt-blocks-container".*?</div>(?=\s*\n\s*<!-- Bottom Status Bar|\s*\n\s*</div>)'
    
    # Simpler: find the raw Gantt body section between X-Axis header close and Bottom Status Bar
    # Marker start: after </div> closing the x-axis header div.flex-1.relative
    # Marker end: <!-- Bottom Status Bar

    # Find position of existing gantt-blocks-container or old rows
    if 'id="gantt-blocks-container"' in content:
        print(f"[2.html] gantt-blocks-container already present - skipping gantt replacement")
        return

    # Find and replace the Gantt scrollable body section
    # The section starts after the X-Axis header closing tag and ends before Bottom Status Bar
    status_bar_pos = content.find('<!-- Bottom Status Bar')
    if status_bar_pos == -1:
        status_bar_pos = content.find('</div>\n            </div>\n        </main>')

    # Find the last </div> before <!-- Bottom Status Bar
    # This closes the gantt chart area container
    area_end = content.rfind('</div>', 0, status_bar_pos)
    # Find where the gantt body section starts (after time header)
    gantt_body_marker = content.rfind('</div>\n                </div>\n            </div>\n            <!-- ', 0, area_end)
    
    axis_end_marker = '<!-- Scrollable Gantt Body -->'
    axis_end_pos = content.find(axis_end_marker)
    
    if axis_end_pos != -1:
        # Found old-style marker
        end_of_rows_pos = content.find('<!-- Bottom Status Bar', axis_end_pos)
        if end_of_rows_pos == -1:
            end_of_rows_pos = content.find('</div>\n            </div>\n        </main>', axis_end_pos)
        
        # Determine the indent before the closing </div> that wraps the gantt chart area
        old_section = content[axis_end_pos:end_of_rows_pos].rstrip()
        
        content = content.replace(
            content[axis_end_pos:end_of_rows_pos],
            new_gantt_body + "\n                "
        )
        print("[2.html] Replaced hardcoded Gantt rows with live container")
    else:
        # Check if floating rows exist (from partial edit)
        row_marker = '<!-- Row 1: NDLS-CNB -->'
        row_pos = content.find(row_marker)
        if row_pos != -1:
            # Find closing before bottom status bar
            end_of_rows_pos = content.find('<!-- Bottom Status Bar', row_pos)
            if end_of_rows_pos == -1:
                end_of_rows_pos = content.find('</div>\n        </main>', row_pos)
            
            # Backtrack to find opening of the scrollable div
            scrollable_start = content.rfind('<div class="flex-1 relative">', 0, row_pos)
            scrollable_start2 = content.rfind('<div class="flex-1 overflow-auto', 0, row_pos)
            start = max(scrollable_start, scrollable_start2)
            
            old_rows_section = content[start:end_of_rows_pos]
            content = content[:start] + new_gantt_body + "\n                " + content[end_of_rows_pos:]
            print("[2.html] Removed floating Gantt rows and inserted live container")
        else:
            print("[2.html] No gantt rows to replace found - manual check needed")

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

fix_gantt_html()

# ─── Verify all 4 pages have expected IDs ─────────────────────────────────────
checks = {
    "1.html": ["id=\"kpi-idle-reduction\"", "id=\"kpi-hours-saved\"", "id=\"kpi-solve-time\"", "id=\"blocks-list\""],
    "2.html": ["id=\"gantt-blocks-container\""],
    "3.html": ["id=\"delta-delay\"", "id=\"delta-conflicts\""],
    "4.html": [],
}
print()
for fname, ids in checks.items():
    path = os.path.join(ROOT, fname)
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    for id_ in ids:
        found = id_ in content
        print(f"  {'[OK]' if found else '[MISSING]'} {fname}: {id_}")
print("\n[DONE]")
