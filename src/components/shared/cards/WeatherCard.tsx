import Card from "@mui/material/Card";

// import Typography from '@mui/material/Typography'
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";

export const WeatherCard = ({ name }: { name: string }) => {
  return (
    <>
      <Card style={{ minHeight: 490 }}>
        <CardHeader title={name} />
        <CardContent></CardContent>
      </Card>
    </>
  );
};
