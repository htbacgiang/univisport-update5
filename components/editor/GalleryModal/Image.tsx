import { FC } from "react";
import NextImage from "next/image";
import CheckMark from "../../common/CheckMark";

interface Props {
  src: string;
  selected?: boolean;
  alt?: string;
  onClick?(): void;
}

const Image: FC<Props> = ({ src, alt = "", selected, onClick }): JSX.Element => {
  return (
    <div
      onClick={onClick}
      className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer group transition-all duration-200 ${
        selected 
          ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-800 shadow-lg' 
          : 'hover:ring-2 hover:ring-gray-300 dark:hover:ring-gray-600 hover:shadow-md'
      }`}
    >
      <NextImage
        src={src}
        layout="fill"
        objectFit="cover"
        alt={alt}
        className={`transition-transform duration-200 ${
          selected ? 'scale-105' : 'group-hover:scale-105'
        }`}
      />
      
      {/* Overlay */}
      <div className={`absolute inset-0 bg-black transition-opacity duration-200 ${
        selected ? 'bg-opacity-20' : 'bg-opacity-0 group-hover:bg-opacity-10'
      }`} />
      
      {/* Check Mark */}
      <div className="absolute top-2 left-2">
        <CheckMark visible={selected || false} />
      </div>
      
      {/* Alt Text Preview */}
      {alt && (
        <div className={`absolute bottom-0 left-0 right-0 bg-black transition-opacity duration-200 ${
          selected ? 'bg-opacity-70' : 'bg-opacity-0 group-hover:bg-opacity-70'
        }`}>
          <p className={`text-white text-xs p-2 transition-opacity duration-200 ${
            selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}>
            {alt.length > 50 ? `${alt.substring(0, 50)}...` : alt}
          </p>
        </div>
      )}
    </div>
  );
};

export default Image;
