import React, { Component } from 'react'
import styles from './styles.css'

const DragNDropItem = (props) => 
  <div data-id={props.dataId} draggable onDragStart={e => props.onDragStart(e)}>
    {props.children}
  </div>

export default class DragNDrop extends Component {
  containerRef = React.createRef()

  componentDidMount() {
    const items = React.Children.map(this.props.children, (child, i) => {
      return <DragNDropItem dataId={i} onDragStart={this.onDragStart}>{ React.cloneElement(child) }</DragNDropItem>
    })
    
    this.setState({ 
      items: items
    })
  }
  
  onDragStart = (e) => {
    const containerRef = this.containerRef.current,
          itemRef = e.target,
          
          style = window.getComputedStyle(containerRef),
          border = {
            left: parseInt(style["border-left"]),
            right: parseInt(style["border-right"]),
            top: parseInt(style["border-top"]),
            bottom: parseInt(style["border-bottom"])
          },
          
          // Container params
          container = {
            left: containerRef.getBoundingClientRect().left + border.left,
            top: containerRef.getBoundingClientRect().top + border.top,
            right: containerRef.getBoundingClientRect().right - border.right,
            bottom: containerRef.getBoundingClientRect().bottom - border.bottom
          },
          
          // Item params - (X, Y) relative to container
          item = {
            id: parseInt(itemRef.dataset.id),
            boundRect: itemRef.getBoundingClientRect()
          },
          
          // Mouse/Touch - (X, Y) relative to item
          client = {
            left: e.clientX - item.boundRect.left,
            top: e.clientY - item.boundRect.top,
            right: item.boundRect.right - e.clientX,
            bottom: item.boundRect.bottom - e.clientY
          }
    
    this.setState({
      client,
      container,
      item
    })
  }
  
  onDragEnd = (e) => {
    const container = this.state.container,
          client = this.state.client,
          el = e.target,
          item = {
            left: e.clientX - client.left,
            top: e.clientY - client.top,
            right: e.clientX + client.right,
            bottom: e.clientY + client.bottom,
            width: this.state.item.boundRect.width,
            height: this.state.item.boundRect.height,
          }

    // Set item position
    el.style.left = e.clientX - client.left - container.left + 'px'
    el.style.top = e.clientY - client.top - container.top + 'px'
    
    // Compare to Container perimeter and adjust accordingly
    // X-axis
    if (item.left < container.left) {
      el.style.left = '0px'
    } else if (item.right > container.right) {
      el.style.left = container.right - container.left - item.width + 'px'
    }
  
    // Y-axis
    if (item.top < container.top) {
      el.style.top = '0px'
    } else if (item.bottom > container.bottom ) {
      el.style.top = container.bottom - container.top - item.height + 'px'
    }
  }
  
  render() {
    return (
      <div ref={this.containerRef} className={styles.container} onDragEnd={this.onDragEnd}>
        { this.state !== null && this.state.items }
      </div>
    )
  }
}