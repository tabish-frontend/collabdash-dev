// components/GaugeChart.tsx
import React, { useState } from 'react';
import { Box, Typography, CircularProgress, Grid, Tooltip, Stack } from '@mui/material';

interface GaugeChartProps {
  percentage: number;
  presentLabel: string;
  absentLabel: string;
}

const GaugeChart: React.FC<GaugeChartProps> = ({ percentage, presentLabel, absentLabel }) => {
  const circleSize = 200;
  const strokeWidth = 3;
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);

  const handleMouseEnter = (segment: string) => {
    setHoveredSegment(segment);
  };

  const handleMouseLeave = () => {
    setHoveredSegment(null);
  };

  return (
    <Stack direction="row" justifyContent="space-around" spacing={2} alignItems="center">
      <Grid item>
        <Box
          sx={{
            position: 'relative',
            display: 'inline-flex',
            width: circleSize,
            height: circleSize,
          }}
        >
          <Tooltip title={`${100 - percentage}% ${absentLabel}`} open={hoveredSegment === 'absent'}>
            <Box
              onMouseEnter={() => handleMouseEnter('absent')}
              onMouseLeave={handleMouseLeave}
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                clipPath: 'circle(50%)',
                zIndex: hoveredSegment === 'absent' ? 1 : 'auto',
              }}
            />
          </Tooltip>
          <CircularProgress
            variant="determinate"
            value={100}
            size={circleSize}
            thickness={strokeWidth}
            sx={{
              color: hoveredSegment === 'absent' ? '#bdbdbd' : '#d6d6d6',
              position: 'absolute',
            }}
          />
          <Tooltip title={`${percentage}% ${presentLabel}`} open={hoveredSegment === 'present'}>
            <Box
              onMouseEnter={() => handleMouseEnter('present')}
              onMouseLeave={handleMouseLeave}
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                clipPath: 'circle(50%)',
                zIndex: hoveredSegment === 'present' ? 1 : 'auto',
              }}
            />
          </Tooltip>
          <CircularProgress
            variant="determinate"
            value={percentage}
            size={circleSize}
            thickness={strokeWidth}
            sx={{ color: hoveredSegment === 'present' ? '#303f9f' : '#3f51b5' }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h5" component="div" color="textSecondary">
              {`${percentage}%`}
            </Typography>
          </Box>
        </Box>
      </Grid>
      <Grid item>
        <Stack direction="column" spacing={3}>
          <Typography
            variant="h6"
            component="div"
            onMouseEnter={() => handleMouseEnter('present')}
            onMouseLeave={handleMouseLeave}
            sx={{ cursor: 'pointer' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 15,
                  height: 15,
                //   backgroundColor: '#3f51b5',
                  borderRadius: '10%',
                  marginRight: 1,
                  backgroundColor: hoveredSegment === 'present' ? '#303f9f' : '#3f51b5',
                }}
              />
              {`${percentage}% ${presentLabel}`}
            </Box>
          </Typography>
          <Typography
            variant="h6"
            component="div"
            onMouseEnter={() => handleMouseEnter('absent')}
            onMouseLeave={handleMouseLeave}
            sx={{ cursor: 'pointer' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 15,
                  height: 15,
                //   backgroundColor: '#d6d6d6',
                  borderRadius: '10%',
                  marginRight: 1,
                  backgroundColor: hoveredSegment === 'absent' ? '#bdbdbd' : '#d6d6d6',
                }}
              />
              {`${100 - percentage}% ${absentLabel}`}
            </Box>
          </Typography>
        </Stack>
      </Grid>
    </Stack>
  );
};

export default GaugeChart;
