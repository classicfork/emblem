import { Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography, ImageList, ImageListItem } from "@mui/material";

export default function MemorialIndexRoute() {
  return (
    <div>
      <Card sx={{ maxWidth: 345 }}>
        <CardHeader title='Dennis Keith Myres' />
        <CardMedia
          sx={{ height: 140 }}
          image="b.jpeg"
          title="Dennis Keith"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            1935 - 2017
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Dennis Keith was born in Mountain, North Dakota to an Icelandic family, and as a young boy moved to National City, California (part of San Diego). He joined the Church of Jesus Christ of Latter-day Saints in his early 20's, and his testimony guided his path in fatherhood, work, and his dealings with everyone around him. His wife of over 50 years, Paula Haymond, 9 children, and over 50 grandchildren survive him. His great legacy lives on in all of them.
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Obituary</Button>
          <Button size="small">Links</Button>
        </CardActions>
      </Card>
      {/* <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
        {itemData.map((item) => (
          <ImageListItem key={item.img}>
            <img
              srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
              alt={item.title}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList> */}
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="error-container">
      I did a whoopsies.
    </div>
  );
}