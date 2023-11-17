import { ImageList, ImageListItem } from "@mui/material";

type Image = {
  id: string;
  memorialId: string;
  fileName: string;
  name: string;
  description: string;
  url: string;
}

type ImageListType = {
  images: Image[];
}

export default function ImageListComponent(props: ImageListType) {
  const {
    images,
  } = props;

  return (
    <div className="justify-start">
      <ImageList style={{margin: '10px 20px'}} cols={12} rowHeight={180}>
        {images.map((image: Image) => (
          <ImageListItem key={image.id}>
            <img
              srcSet={`${image.fileName}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              src={`${image.url}/${image.fileName}?w=164&h=164&fit=crop&auto=format`}
              alt={image.name}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
}