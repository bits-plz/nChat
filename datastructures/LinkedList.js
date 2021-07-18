"use strict";
/**
 * Linked List implementation
 */
exports.__esModule = true;
exports.LinkedList = void 0;
var Node = /** @class */ (function () {
    function Node(_v) {
        this.val = _v;
        this.next = null;
    }
    return Node;
}());
var LinkedList = /** @class */ (function () {
    function LinkedList() {
        var _this = this;
        this.isEmpty = function () { return _this.size == 0; };
        this.getSize = function () { return _this.size; };
        this.head = null;
        this.size = 0;
    }
    /**
     * @description adds Node to the end
     * @param {*} _v
     */
    LinkedList.prototype.addNodeToEnd = function (_v) {
        this.addNodeAt(_v, this.size);
    };
    /**
     * @description adds a node at a particular index
     * @param {*} _v
     * @param {*} _idx
     * @returns void
     */
    LinkedList.prototype.addNodeAt = function (_v, _idx) {
        if (_idx >= this.size)
            return;
        if (this.head == null && this.size == 0 && _idx == 0)
            this.head = new Node(_v);
        else {
            var current = this.head;
            var i = 0;
            while (i < this.size) {
                if (i == _idx - 1) {
                    var temp = new Node(_v);
                    temp.next = current.next;
                    current.next = temp;
                    break;
                }
                current = current.next;
                i++;
            }
        }
    };
    LinkedList.prototype.pop = function () {
        this.popAt(this.size - 1);
    };
    LinkedList.prototype.popElement = function (_val) {
        var idx = this.search(_val);
        if (idx != -1)
            this.popAt(idx);
    };
    /**
     * @description it pops the element at a particular index
     * @param idx
     * @returns void
     */
    LinkedList.prototype.popAt = function (idx) {
        var i = 0;
        var current = this.head;
        while (i < this.size) {
            if (idx == 0) {
                if (this.head.next) {
                    this.head = this.head.next;
                }
                else
                    this.head = null;
                this.size--;
                return;
            }
            if (i == idx - 1) {
                current.next = current.next.next;
                this.size--;
                break;
            }
            i++;
            current = current.next;
        }
    };
    /**
     *
     * @param {int} _v
     * @returns {int} index of the first occurence of element, returns -1 if it can't find it
     */
    LinkedList.prototype.search = function (_v) {
        var current = this.head;
        var i = 0;
        while (current) {
            if (current.val == _v)
                return i;
            current = current.next;
            i++;
        }
        return -1;
    };
    return LinkedList;
}());
exports.LinkedList = LinkedList;
