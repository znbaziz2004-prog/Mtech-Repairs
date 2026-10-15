import './Marquee.css';

const brands = [
  'Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Sony',
  'Huawei', 'Oppo', 'Vivo', 'Nokia', 'Microsoft', 'Dell',
];

export default function Marquee() {
  return (
    <div className="marquee">
      <div className="container marquee__label">
        <span className="mono-tag">Devices we service</span>
      </div>
      <div className="marquee__track-wrap">
        <div className="marquee__track">
          {[...brands, ...brands].map((b, i) => (
            <span className="marquee__item" key={`${b}-${i}`}>
              {b}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
