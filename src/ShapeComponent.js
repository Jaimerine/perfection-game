import * as ICONS from "./shapes"

//dynamically constructs shape components
export default function ShapeComponent(props) {
    const ShapeComponent = ICONS[props.name] //i.e. props.name = "Star"
    return <ShapeComponent styleApplied={props.styleApplied}/>
}