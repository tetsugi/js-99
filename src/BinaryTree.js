/**
 * 二分木を表現する
 * @author tetsugi
 */
export default class BinaryTree {
  
  /**
   * @param {any[]} list 
   */
  constructor(list) {
    this.value = list[0]
    this.left = Array.isArray(list[1]) ? new BinaryTree(list[1]) : list[1]
    this.right = Array.isArray(list[2]) ? new BinaryTree(list[2]) : list[2]
  }

  toString() {
    return JSON.stringify(this, null, 2)
  }
}