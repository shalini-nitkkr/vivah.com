export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "6px" }}>
          Matrimonial Matching System
        </h3>

        <p style={{ color: "var(--text-muted)" }}>
          Developed by{" "}
          <strong>Riyanshi</strong>,{" "}
          <strong>Manisha</strong>,{" "}
          <strong>Shalini</strong>
        </p>

        <p
          style={{
            fontSize: "12px",
            color: "#9ca3af",
            marginTop: "6px"
          }}
        >
          © {new Date().getFullYear()} All Rights Reserved
        </p>
      </div>
    </footer>
  )
}