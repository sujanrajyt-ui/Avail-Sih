"""Replace hardcoded Gantt rows in 2.html using direct line splicing."""
with open("2.html", "r", encoding="utf-8") as f:
    lines = f.readlines()

# Find exact indices for the rows we want to remove
# Row 1 container starts at line 414 (index 413) with:  <div class="flex-1 relative">
# Everything ends just before <!-- Bottom Status Bar at ~line 499

start_i = None
end_i = None

for i, line in enumerate(lines):
    if '<!-- Maintenance Block: Gold' in line and start_i is None:
        # Back up 2 lines to get the outer <div class="flex-1 relative">
        start_i = i - 2
    if '<!-- Bottom Status Bar' in line and start_i is not None:
        end_i = i
        break

if start_i is None or end_i is None:
    print(f"Markers not found (start={start_i}, end={end_i})")
    exit(1)

print(f"Replacing lines {start_i+1} to {end_i} (0-indexed {start_i}-{end_i})")

replacement = [
    '                <!-- Live Gantt Body \u2014 populated by /api/merge-blocks -->\n',
    '                <div id="gantt-blocks-container" class="flex-1 overflow-y-auto flex flex-col" style="min-height:280px">\n',
    '                    <div class="flex flex-col items-center justify-center flex-1 text-on-surface-variant gap-2" style="padding:2rem">\n',
    '                        <span class="material-symbols-outlined text-primary" style="font-size:2.5rem;opacity:0.6">timeline</span>\n',
    '                        <span class="text-sm">Loading live block schedule\u2026</span>\n',
    '                    </div>\n',
    '                </div>\n',
]

new_lines = lines[:start_i] + replacement + lines[end_i:]

with open("2.html", "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print("Done. Lines after:", len(new_lines))

# Verify
with open("2.html", "r", encoding="utf-8") as f:
    content = f.read()
print("gantt-blocks-container present:", 'id="gantt-blocks-container"' in content)
print("Hardcoded rows gone:", '<!-- Row 2: CNB-PRYJ' not in content)
