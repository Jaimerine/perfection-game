import * as ICONS from "./shapes"

const ShapeComponent = props => {
    const ShapeComponent = ICONS[props.name] // i.e. props.name === "Star"
    return <ShapeComponent styleApplied={props.styleApplied}/>
}

export default ShapeComponent;