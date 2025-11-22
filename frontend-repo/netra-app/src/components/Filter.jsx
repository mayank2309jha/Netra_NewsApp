import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  FormGroup,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  Button,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const FilterContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  borderRadius: theme.spacing(1),
  marginBottom: theme.spacing(3),
  backgroundColor: '#ffffff',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
}));

const FilterTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.15rem',
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
}));

const FilterSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),

  '&:last-of-type': {
    marginBottom: 0,
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.9rem',
  marginBottom: theme.spacing(1),
  color: '#666',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
}));

const Filter = ({ onFilterChange }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    categories: [],
    sources: [],
    dateRange: 'all',
  });

  const categories = [
    'India',
    'World',
    'Business',
    'Technology',
    'Sports',
    'Science',
    'Entertainment',
    'Local',
  ];

  const sources = [
    'Times India',
    'Reuters',
    'BBC',
    'CNN',
    'Tech Crunch',
    'The Guardian',
  ];

  const dateRanges = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'all', label: 'All Time' },
  ];

  const handleCategoryChange = (category) => {
    const updated = selectedFilters.categories.includes(category)
      ? selectedFilters.categories.filter((c) => c !== category)
      : [...selectedFilters.categories, category];

    const newFilters = { ...selectedFilters, categories: updated };
    setSelectedFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleSourceChange = (source) => {
    const updated = selectedFilters.sources.includes(source)
      ? selectedFilters.sources.filter((s) => s !== source)
      : [...selectedFilters.sources, source];

    const newFilters = { ...selectedFilters, sources: updated };
    setSelectedFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleDateRangeChange = (range) => {
    const newFilters = { ...selectedFilters, dateRange: range };
    setSelectedFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      categories: [],
      sources: [],
      dateRange: 'all',
    };
    setSelectedFilters(resetFilters);
    onFilterChange?.(resetFilters);
  };

  return (
    <FilterContainer elevation={0}>
      <FilterTitle variant="h6">Filters</FilterTitle>

      {/* Categories Section */}
      <FilterSection>
        <SectionTitle variant="caption">Categories</SectionTitle>
        <FormGroup sx={{ gap: 0.5 }}>
          {categories.map((category) => (
            <FormControlLabel
              key={category}
              control={
                <Checkbox
                  size="small"
                  checked={selectedFilters.categories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  sx={{
                    '&.Mui-checked': {
                      color: '#1976d2',
                    },
                  }}
                />
              }
              label={<Typography sx={{ fontSize: '0.875rem', color: '#333' }}>{category}</Typography>}
              sx={{ margin: 0 }}
            />
          ))}
        </FormGroup>
      </FilterSection>

      <Divider sx={{ my: 2 }} />

      {/* Date Range Section */}
      <FilterSection>
        <SectionTitle variant="caption">Date Range</SectionTitle>
        <RadioGroup
          value={selectedFilters.dateRange}
          onChange={(e) => handleDateRangeChange(e.target.value)}
          sx={{ gap: 0.5 }}
        >
          {dateRanges.map((range) => (
            <FormControlLabel
              key={range.value}
              value={range.value}
              control={
                <Radio 
                  size="small"
                  sx={{
                    '&.Mui-checked': {
                      color: '#1976d2',
                    },
                  }}
                />
              }
              label={<Typography sx={{ fontSize: '0.875rem', color: '#333' }}>{range.label}</Typography>}
              sx={{ margin: 0 }}
            />
          ))}
        </RadioGroup>
      </FilterSection>

      <Divider sx={{ my: 2 }} />

      {/* Sources Section */}
      <FilterSection>
        <SectionTitle variant="caption">News Sources</SectionTitle>
        <FormGroup sx={{ gap: 0.5 }}>
          {sources.map((source) => (
            <FormControlLabel
              key={source}
              control={
                <Checkbox
                  size="small"
                  checked={selectedFilters.sources.includes(source)}
                  onChange={() => handleSourceChange(source)}
                  sx={{
                    '&.Mui-checked': {
                      color: '#1976d2',
                    },
                  }}
                />
              }
              label={<Typography sx={{ fontSize: '0.875rem', color: '#333' }}>{source}</Typography>}
              sx={{ margin: 0 }}
            />
          ))}
        </FormGroup>
      </FilterSection>

      {/* Reset Button */}
      <Box sx={{ mt: 2.5 }}>
        <Button
          variant="outlined"
          size="small"
          fullWidth
          onClick={handleReset}
          sx={{ 
            color: '#1976d2',
            borderColor: '#1976d2',
            textTransform: 'none',
            fontSize: '0.875rem',
            fontWeight: 500,
            '&:hover': {
              borderColor: '#1565c0',
              backgroundColor: 'rgba(25, 118, 210, 0.04)',
            }
          }}
        >
          Reset Filters
        </Button>
      </Box>
    </FilterContainer>
  );
};

export default Filter;