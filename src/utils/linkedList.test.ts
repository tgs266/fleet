import { LinkedList } from "./LinkedList"

test("test 1", () => {
    const ll = new LinkedList<number>();
    ll.push(1)
    ll.push(2)
    ll.push(3)
    expect(ll.length).toBe(3)
    ll.pop()
    ll.pop()
    ll.pop()
    expect(ll.length).toBe(0)
    ll.pop()
    expect(ll.length).toBe(0)
})

test("test 2", () => {
    const ll = new LinkedList<number>();
    ll.push(1)
    ll.push(2)
    ll.push(3)
    expect(ll.length).toBe(3)
    ll.shift()
    ll.shift()
    ll.shift()
    expect(ll.length).toBe(0)
    ll.shift()
    expect(ll.length).toBe(0)
})

test("test 3", () => {
    const ll = new LinkedList<number>();
    ll.push(1)
    ll.push(2)
    ll.push(3)
    const ll2 = new LinkedList<number>();
    ll2.push(1)
    ll2.push(2)
    ll2.push(3)
    expect(ll.length).toBe(3)
    expect(ll2.length).toBe(3)
    ll.concat(ll2)
    expect(ll.length).toBe(6)
})

test("test 4", () => {
    const ll = new LinkedList<number>();
    ll.push(1)
    ll.push(2)
    ll.push(3)
    const ll2 = new LinkedList<number>();
    ll2.push(1)
    expect(ll.length).toBe(3)
    expect(ll2.length).toBe(1)
    ll.concat(ll2)
    expect(ll.length).toBe(4)
})

test("test 5", () => {
    const ll = new LinkedList<number>();
    const ll2 = new LinkedList<number>();
    ll2.push(1)
    ll2.push(2)
    expect(ll.length).toBe(0)
    expect(ll2.length).toBe(2)
    ll.concat(ll2)
    expect(ll.length).toBe(2)
})

test("test 6", () => {
    const ll = new LinkedList<number>();
    ll.push(1)
    ll.tail = null
    const ll2 = new LinkedList<number>();
    ll2.push(1)
    ll2.push(2)
    expect(ll.length).toBe(1)
    expect(ll2.length).toBe(2)
    ll.concat(ll2)
    expect(ll.length).toBe(3)
})
