export const FormInput = ({
  label,
  value,
  onChange,
  type = "text",
  min,
  max,
  name,
}: any) => (
  <div className="input-container">
    <label>{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      required
      min={min}
      max={max}
      name={name}
    />
    <style jsx>{`
      .input-container {
        margin-bottom: 1.5rem;
        display: flex;
        flex-direction: column;
        color: #333;
      }
      label {
        font-size: 1.1rem;
        font-weight: bold;
        margin-bottom: 0.5rem;
        color: #333;
      }
      input {
        padding: 0.7rem;
        border-radius: 8px;
        border: 1px solid #ccc;
        font-size: 1rem;
        background-color: #f9f9f9;
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: border-color 0.3s ease;
        color: #333;
      }
      input:focus {
        border-color: #0070f3;
        outline: none;
      }
    `}</style>
  </div>
);
