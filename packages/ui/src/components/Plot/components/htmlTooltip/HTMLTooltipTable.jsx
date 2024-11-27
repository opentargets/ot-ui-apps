export default function TooltipTable({ children }) {
  return (
    <div style={{
      width: "100%",
      height: "100%",
      background: "#fffc",
      borderColor: "#ddd",
      borderWidth: "1px",
      borderStyle: "solid",
      borderRadius: "0.2rem",
      padding: "0.25em 0.5rem",
    }}>
      <table style={{ borderSpacing: "0 0.4rem", border: "1" }}>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  );
}
