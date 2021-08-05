function Person(props: { name: string; index: number }) {
  return (
    <div
      className="ps-1 pe-1 border-top d-flex align-items-center"
      style={{
        gridRow: props.index + 2
      }}
    >
      {props.name}
    </div>
  );
}

export default Person;
