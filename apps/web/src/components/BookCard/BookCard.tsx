import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { useState } from "react";
import type { Book } from "../../types";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const gatsbyImage = getImage(book.image);
  const isExternalImage = typeof book.image === "string";
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      sx={{
        width: "150px",
        flex: "0 0 auto",
        position: "relative",
      }}
    >
      {isExternalImage && !imageError ? (
        <img
          sx={{
            width: "100%",
            height: "225px",
            objectFit: "cover",
            border: "2px solid black",
            borderColor: "primary",
            borderRadius: 3,
          }}
          src={book.image}
          alt={book.title}
          loading="lazy"
          onError={handleImageError}
        />
      ) : !isExternalImage && gatsbyImage ? (
        <GatsbyImage
          sx={{
            width: "100%",
            border: "2px solid black",
            borderColor: "primary",
            borderRadius: 3,
          }}
          key={book.title}
          alt={book.title}
          image={gatsbyImage}
        />
      ) : (
        <div
          sx={{
            width: "100%",
            height: "225px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid black",
            borderColor: "primary",
            borderRadius: 3,
            backgroundColor: "muted",
            color: "text",
            textAlign: "center",
            padding: 2,
            fontSize: 1,
          }}
        >
          <div>
            <div sx={{ fontWeight: "bold", mb: 1 }}>{book.title}</div>
            <div sx={{ fontSize: 0 }}>{book.author}</div>
          </div>
        </div>
      )}
    </div>
  );
}
