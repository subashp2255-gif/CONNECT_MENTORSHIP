import { useState } from 'react';

export default function LazyImage({ src, alt, className = '', placeholderClassName = '', ...rest }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${placeholderClassName}`}>
      {!loaded && <div className="absolute inset-0 bg-surface animate-pulse" />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`${className} transition duration-300 ${loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}
        {...rest}
      />
    </div>
  );
}
