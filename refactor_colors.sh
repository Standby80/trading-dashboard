#!/bin/bash
find src/app src/components -type f \( -name "*.tsx" -o -name "*.ts" \) | while read file; do
  sed -i '' 's/bg-\[#0b0e14\]/bg-background/g' "$file"
  sed -i '' 's/bg-\[#131823\]/bg-card/g' "$file"
  sed -i '' 's/bg-\[#13151a\]/bg-background/g' "$file"
  sed -i '' 's/bg-\[#1a2130\]/bg-muted/g' "$file"
  sed -i '' 's/bg-\[#1e2330\]/bg-muted/g' "$file"
  sed -i '' 's/border-\[#1e2330\]/border-border/g' "$file"
  sed -i '' 's/border-white\/5/border-border/g' "$file"
  sed -i '' 's/border-white\/10/border-border/g' "$file"
  sed -i '' 's/text-slate-50\b/text-foreground/g' "$file"
  sed -i '' 's/text-slate-200\b/text-foreground/g' "$file"
  sed -i '' 's/text-white\b/text-foreground/g' "$file"
  sed -i '' 's/text-slate-400\b/text-muted-foreground/g' "$file"
  sed -i '' 's/text-slate-500\b/text-muted-foreground/g' "$file"
  sed -i '' 's/text-slate-300\b/text-muted-foreground/g' "$file"
done
