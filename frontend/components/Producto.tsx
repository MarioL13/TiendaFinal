interface ProductCardProps {
  title: string;
  price: string;
  image: string;
  descripcion: string;
}

const ProductCard = ({ title, price, image, descripcion}: ProductCardProps) => {
  return (
    <section className="text-gray-400 bg-gray-900 body-font">
      <div className="container mx-auto flex py-8 md:flex-row flex-col items-center min-h-[600px]">
        <div className="w-full md:w-1/2 flex justify-center items-center h-full">
          <img className="object-contain object-center rounded w-full h-[400px] md:h-[500px]" alt={title} src={image} />
        </div>
        <div className="w-full md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left mb-8 md:mb-0 items-center text-center">
          <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-white">{title}</h1>
          <p className="mb-8 leading-relaxed">{descripcion}</p>
          <p className="mb-8 leading-relaxed">Precio: {price}</p>
        </div>
      </div>
    </section>
  );
};

export default ProductCard;
