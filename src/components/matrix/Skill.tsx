function Skill(props: { name: string; index: number }) {
  return (
    <div
      className="ps-1 pe-1 border-start d-flex align-items-center"
      style={{
        gridColumn: props.index + 2
      }}
    >
      {props.name}
    </div>
  );
}

export default Skill;
