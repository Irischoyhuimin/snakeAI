// Queue Element consisting of the element and its priority

class QueueElement {
    constructor(element, priority) {
      this.element = element;
      this.priority = priority;
    }
  }
  
  // PriorityQueue implementation based off minHeap
  
  class PriorityQueue {
    constructor() {
      this.heap = [];
    }
  
    // element of arr[i] children can be found in arr[2i+1] and arr[2i+2] and its parent index arr[Math.floor((i-1)/2)]
  
    push = (element, priority) => {
  
      let queueElement = new QueueElement(element, priority);
  
      this.heap.push(queueElement);
  
      let index = this.heap.length - 1;
  
      while (index > 0) {
        let node = this.heap[index];
        let parentIndex = Math.floor((index - 1) / 2);
        let parent = this.heap[parentIndex];
  
        if (parent.priority <= node.priority) {
          break;
        } else {
          this.heap[index] = parent;
          this.heap[parentIndex] = node;
          index = parentIndex;
        }
      }
    };
  
    minHeapify = (index) => {
      let leftchild = 2 * index + 1;
      let rightchild = 2 * index + 2;
      let smallest = index;
  
      const length = this.heap.length;
  
      if (leftchild < length && this.heap[leftchild].priority < this.heap[index].priority) {
        smallest = leftchild;
      }
  
      if (rightchild < length && this.heap[rightchild].priority < this.heap[index].priority) {
        smallest = rightchild;
      }
  
      if (smallest !== index) {
        let largerNode = this.heap[smallest];
        this.heap[smallest] = this.heap[index];
        this.heap[index] = largerNode;
        this.minHeapify(smallest);
      }
    };
  
    pop = () => {
      let max = this.heap[0];
      this.heap[0] = this.heap.pop();
  
      this.minHeapify(0);
  
      return max.element;
    };
  
    peak = () => {
      return this.heap[0].element;
    }
  
    isEmpty = () => {
      if (this.heap.length === 0) {
        return true
      }
      return false;
    }
  
    elements = () => {
      const elements = [];
  
      this.heap.forEach((queueElement) => {
        elements.push(queueElement.element);
      }) 
  
      return elements;
  
    }
  }
  
  
  
  export default PriorityQueue;