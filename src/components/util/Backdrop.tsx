function Backdrop(props: { children: any }) {
  return <div className="modal-backdrop fade show">{props.children}</div>;
}

export default Backdrop;
