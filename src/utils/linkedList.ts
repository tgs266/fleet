/* eslint-disable no-param-reassign */
/* eslint-disable max-classes-per-file */
export class ListNode<T> {
    data: T;

    post: ListNode<T>;

    pre: ListNode<T>;

    constructor(data: T) {
        this.data = data;
        this.post = null;
    }

    // returns the added node
    append(data: T) {
        const node = new ListNode<T>(data);
        this.post = node;
        node.pre = this;
        return node;
    }
}

export class LinkedList<T> {
    head: ListNode<T>;

    tail: ListNode<T>;

    length = 0;

    push(value: T) {
        this.length += 1;
        if (!this.head) {
            this.head = new ListNode<T>(value);
        } else if (!this.tail) {
            this.tail = this.head.append(value);
        } else {
            this.tail = this.tail.append(value);
        }
    }

    shift() {
        if (this.length === 0) {
            return null;
        }
        this.length -= 1;
        const value = this.head.data;
        this.head = this.head.post;
        if (this.head) {
            this.head.pre = null;
        }
        if (this.length === 1) {
            this.tail = null;
            this.head.post = null;
        }
        return value;
    }

    pop() {
        if (this.length === 0) {
            return null;
        }
        this.length -= 1;
        const value = this.tail.data;
        this.tail = this.tail.pre;
        if (this.tail) {
            this.tail.post = null;
        }
        return value;
    }

    concat(other: LinkedList<T>) {
        if (other.length === 1) {
            this.push(other.head.data);
            return this;
        }

        if (!this.head) {
            this.head = other.head;
            this.tail = other.tail;
            this.length = other.length;
            return this;
        }
        if (!this.tail) {
            this.tail = other.head;
            this.tail.pre = this.head;
            this.head.post = this.tail;
            this.length = other.length + this.length;
            return this;
        }
        other.head.pre = this.tail;
        this.tail.post = other.head;
        this.tail = other.tail;
        this.length += other.length;
        return this;
    }
}
