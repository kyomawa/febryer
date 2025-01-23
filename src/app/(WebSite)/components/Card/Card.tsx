
const items = [
  { image: "image1.jpg", title: "Title 1", description: "Description 1" },
  { image: "image2.jpg", title: "Title 2", description: "Description 2" },
  { image: "image3.jpg", title: "Title 3", description: "Description 3" },
];

export default function Card() {
  return items.map((item) => (
    <div key={item.title} className="w-full">
      <div className="h-80 rounded-lg bg-white p-4 shadow-lg">
        <img src={item.image} alt={item.title} />
      </div>
      <h3 className="text-md font-bold">{item.title}</h3>
    </div>
  ));
}
