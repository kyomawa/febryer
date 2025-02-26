const items = [
  { image: "image1.jpg", title: "Title 1", description: "Description 1" },
  { image: "image2.jpg", title: "Title 2", description: "Description 2" },
  { image: "image3.jpg", title: "Title 3", description: "Description 3" },
  { image: "image3.jpg", title: "Title 3", description: "Description 3" },
];

const api =
  "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=fe_bryer&inputtype=textquery&fields=place_id&key=YOUR_API_KEY";

export default function Testimonial() {
  return items.map((item) => (
    <div key={item.title} className="w-full">
      <div className="mt-4 h-80 gap-4 rounded-lg bg-white p-4 shadow-lg">
        {/* <img src={item.image} alt={item.title} /> */}
        <h3 className="text-md font-bold">{item.title}</h3>
      </div>
    </div>
  ));
}
