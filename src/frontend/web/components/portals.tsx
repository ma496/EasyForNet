/**
 * Renders the global portal mount nodes (`popper-portal` and `modal-portal`) used by overlay libraries to render content outside the normal DOM hierarchy.
 */
const Portals = () => {
  return (
    <>
      <div id="popper-portal"></div>
      <div id="modal-portal"></div>
    </>
  )
}

export default Portals
