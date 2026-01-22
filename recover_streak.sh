#!/bin/bash

# GitHub Commit Streak Recovery Script
# Creates commits for specific dates in January 2026

DATES=(1 23 4 5 7 8 9 11 16 22)
YEAR=2026
MONTH=01

for date in "${DATES[@]}"; do
    # Pad date with leading zero if needed
    DATE_STR=$(printf "%02d" $date)
    COMMIT_DATE="$YEAR-$MONTH-${DATE_STR}T12:00:00"
    
    # Create or update a file
    echo "Commit on $DATE_STR January" >> contributions.txt
    
    # Stage the file
    git add contributions.txt
    
    # Create commit with the specific date
    GIT_COMMITTER_DATE="$COMMIT_DATE" \
    GIT_AUTHOR_DATE="$COMMIT_DATE" \
    git commit -m "Contribution on January $DATE_STR"
    
    echo "✓ Created commit for January $DATE_STR, 2026"
done

echo ""
echo "All commits created! Run 'git push' to push to GitHub."