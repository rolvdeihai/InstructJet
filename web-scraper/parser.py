# parser.py

# Your existing parser code goes here
from typing import List
import pandas as pd
import re

def remove_last_word(text, word):
    matches = list(re.finditer(rf'\b{re.escape(word)}\b', text, flags=re.IGNORECASE))
    if matches:
        last_match = matches[-1]
        start, end = last_match.span()
        text = text[:start] + text[end:]
    return re.sub(r'(,\s*)+', ', ', text.strip())
    
def parse_address(address: str, location: str) -> pd.DataFrame:
    places = pd.DataFrame()
    places['Address'] = [address if not pd.isna(address) else "NA"]
    places['Street'] = ["NA"]
    places['City'] = ["NA"]
    places['State'] = ["NA"]
    
    if pd.isna(address):
        return places
    
    location_parts = location.split(',') if not pd.isna(location) else []
    
    if address.startswith("[G]"):
        places['Address'] = [address.replace("[G]", "")]
        places['Street'] = [address.replace("[G]", "")]
        if len(location_parts) > 1:
            places['State'] = [location_parts[-1].strip().upper() or "NA"]
            places['City'] = [location_parts[-2].strip().title() or "NA"]
        return places
        
    if address.startswith("[H]"):
        places['Address'] = [address.replace("[H]", "")]
        if places['Address'].iloc[0].upper() == "NA":
            places['City'] = ["NA"]
            places['State'] = [location_parts[-1].strip().upper() if location_parts else "NA"]
            return places
        
        address_parts = address.replace("[H]", "").split(',')
        if len(address_parts) > 4:
            places['Street'] = [address_parts[0].strip() or "NA"]
            places['City'] = [address_parts[-3].strip() or "NA"]
            state = re.sub(r'[\d\s\-]', '', address_parts[-2].strip())
            places['State'] = [state if state else "NA"]
        elif len(address_parts) == 4:
            places['Street'] = [address_parts[0].strip() or "NA"]
            places['City'] = [address_parts[1].strip() or "NA"]
            state = re.sub(r'[\d\s\-]', '', address_parts[2].strip())
            places['State'] = [state if state else "NA"]
        elif len(address_parts) == 3:
            places['Street'] = ["NA"]
            places['City'] = [address_parts[0].strip() or "NA"]
            state = re.sub(r'[\d\s\-]', '', address_parts[1].strip())
            places['State'] = [state if state else "NA"]
        elif len(address_parts) == 1:
            places['Street'] = [address_parts[0].strip() or "NA"]
        return places
    
    address_parts = address.split(',')
    
    if len(address_parts) >= 3:
        places['Street'] = [address_parts[0].strip() or "NA"]
        places['City'] = [address_parts[1].strip() or "NA"]
        state = re.sub(r'[\d\s\-]', '', address_parts[2].strip())
        places['State'] = [state if state else "NA"]
    elif len(address_parts) == 2:
        places['Street'] = [address_parts[0].strip() or "NA"]
        places['City'] = [address_parts[1].strip() or "NA"]
    else:
        places['Street'] = [address_parts[0].strip() or "NA"]
    
    return places

def parse_number(raw: str) -> str:
    if pd.isna(raw):
        return raw
    
    digits_only = re.sub(r"[^\d]", "", raw)

    if len(digits_only) < 10:
        return raw

    local = digits_only[-10:]
    area = local[:3]
    mid = local[3:6]
    last = local[6:]
    
    return f"({area})-{mid}-{last}"
   
def parse_data(scraped: pd.DataFrame, fieldnames: List[str], location: str) -> pd.DataFrame:
    address_dfs = [parse_address(address, location) for address in scraped['Address']]
    address_df = pd.concat(address_dfs, ignore_index=True)

    scraped['Business_phone'] = scraped['Business_phone'].apply(parse_number)

    scraped = pd.concat([scraped.reset_index(drop=True), address_df.drop(columns='Address').reset_index(drop=True)], axis=1)
    
    og_fields = fieldnames
    extra_cols = [col for col in ['Street', 'City', 'State'] if col in scraped.columns]
    addr_idx = og_fields.index('Address')
    
    reordered = (
        og_fields[:addr_idx] +
        extra_cols +
        og_fields[addr_idx + 1:]
    )
    scraped = scraped[[col for col in reordered if col in scraped.columns]]

    if 'Address' in scraped.columns:
        scraped = scraped.drop(columns='Address')

    return scraped