#!/bin/bash

# Auto-create timeline posts from untracked images
# This script finds all untracked image files and creates markdown posts for them

set -e

TIMELINE_DIR="timeline"
STATIC_IMG_DIR="static/img"

# Color output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Looking for untracked images...${NC}"

# Get today's date in various formats
TODAY_ISO=$(date +%Y-%m-%d)
TODAY_FULL=$(date +%Y-%m-%dT00:00:00)

# Function to parse date from filename
parse_date_from_filename() {
    local filename="$1"
    
    # Check if filename contains "undated", "date-unknown", "date-tk", etc.
    if echo "$filename" | grep -qiE '(undated|date-unknown|date-tk|no-date)'; then
        echo "$TODAY_FULL"
        return
    fi
    
    # Try to match pattern: month-day-year (e.g., apr-19-2019, jan-4-2026)
    if echo "$filename" | grep -qiE '(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)-[0-9]{1,2}-[0-9]{4}'; then
        # Extract the date parts
        month=$(echo "$filename" | grep -oiE '(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)-[0-9]{1,2}-[0-9]{4}' | cut -d'-' -f1 | tr '[:upper:]' '[:lower:]')
        day=$(echo "$filename" | grep -oiE '(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)-[0-9]{1,2}-[0-9]{4}' | cut -d'-' -f2)
        year=$(echo "$filename" | grep -oiE '(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)-[0-9]{1,2}-[0-9]{4}' | cut -d'-' -f3)
        
        # Convert month name to number
        case "$month" in
            jan) month_num="01" ;;
            feb) month_num="02" ;;
            mar) month_num="03" ;;
            apr) month_num="04" ;;
            may) month_num="05" ;;
            jun) month_num="06" ;;
            jul) month_num="07" ;;
            aug) month_num="08" ;;
            sep) month_num="09" ;;
            oct) month_num="10" ;;
            nov) month_num="11" ;;
            dec) month_num="12" ;;
        esac
        
        # Pad day with leading zero if needed
        day=$(printf "%02d" $day)
        
        echo "${year}-${month_num}-${day}T00:00:00"
        return
    fi
    
    # If no date pattern found, use today
    echo "$TODAY_FULL"
}

# Counter for created posts
CREATED=0
SKIPPED=0

# Find untracked files in git
while IFS= read -r file; do
    # Check if it's an image file in static/img
    if [[ "$file" =~ ^static/img/.*\.(jpg|jpeg|png|gif|webp|JPG|JPEG|PNG|GIF|WEBP)$ ]]; then
        
        # Extract filename without extension and path
        filename=$(basename "$file")
        filename_no_ext="${filename%.*}"
        
        # Get the image path relative to repo root
        image_path="/$file"
        
        # Parse date from filename
        post_date=$(parse_date_from_filename "$filename_no_ext")
        
        # Create a humanized title from filename
        # Remove date patterns like -jan-4-2026 or -2026-01-04
        title=$(echo "$filename_no_ext" | \
                sed -E 's/-[a-z]{3}-[0-9]{1,2}-[0-9]{4}$//' | \
                sed -E 's/-[0-9]{4}-[0-9]{2}-[0-9]{2}$//' | \
                sed 's/-/ /g')
        
        # Create post filename
        post_filename="${TIMELINE_DIR}/${filename_no_ext}.md"
        
        # Check if post already exists
        if [ -f "$post_filename" ]; then
            echo -e "${YELLOW}⊘ Skipped (already exists): $post_filename${NC}"
            ((SKIPPED++))
            continue
        fi
        
        # Create the post file
        cat > "$post_filename" << EOF
---
title: $title
date: $post_date
excerpt: 
summary: 
image: $image_path
tags:
  - 

---

![$title]($image_path)
EOF
        
        echo -e "${GREEN}✓ Created: $post_filename${NC}"
        ((CREATED++))
    fi
done < <(git status --porcelain | grep '^??' | awk '{print $2}')

echo ""
echo -e "${BLUE}Summary:${NC}"
echo -e "  ${GREEN}Created: $CREATED posts${NC}"
echo -e "  ${YELLOW}Skipped: $SKIPPED posts${NC}"

if [ $CREATED -eq 0 ]; then
    echo ""
    echo "No new images found. Add some images to static/img/ and run this script again!"
fi
