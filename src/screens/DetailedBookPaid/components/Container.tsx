export const Container = ({ children, custo }: any): any => {
  return (
    <div className="container">
      <h1>Generate and Review Your Ebook</h1>
      <h1>Custo atual(em dolares): {custo}</h1>
      {children}
      <style jsx>{`
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem;
          background-color: #f7f7f7;
          border-radius: 12px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          font-family: Arial, sans-serif;
          color: #333;
        }
        h1 {
          text-align: center;
          font-size: 2rem;
          color: #333;
          margin-bottom: 2rem;
        }
      `}</style>
    </div>
  );
};
