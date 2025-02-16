import styles from '../shop/shop.module.css';

export default function Item({ item, onClick, onHover }) {
  return (
    <div 
      className={styles.item} 
      key={item.id} 
      onClick={onClick}
      onMouseEnter={onHover}
    >
      <div className={styles.itemInfo}>
        <h2>{item.name}</h2>
        <p>{item.description}</p>
      </div>
      <img src={item.photo} alt={item.name} />
      <p className={styles.itemPrice}>¥{item.price}</p>
    </div>
  );
} 