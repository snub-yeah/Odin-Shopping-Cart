export default function Item({ item }) {
  return (
    <div key={item.id}>
      <h2>{item.name}</h2>
      <p>{item.price}</p>
      <p>{item.description}</p>
      <img src={item.photo} alt={item.name} />
    </div>
  );
} 