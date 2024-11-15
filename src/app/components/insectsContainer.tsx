import Card from "./ui/card";

const Insects = () => {
  return (
    <div className="max-w-screen-2xl mx-auto p-5 sm:p-10 md:p-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        <Card />
        <Card />
        <Card />
        <Card />
      </div>
    </div>
  );
};

export default Insects;