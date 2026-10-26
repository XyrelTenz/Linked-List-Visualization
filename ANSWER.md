# Linked List Quiz — Answer Key & Presentation Alignment Guide

This document verifies the connection between each of the **15 Quiz Questions** and the **10 Presentation Slides**, providing the canonical answer, acceptable alternate answers (for manual grading), and the exact presentation slide reference.

---

## Alignment Verification Summary

| Question # | Section | Topic | Presentation Slide Reference | Verified Connected? |
|:---:|:---|:---|:---|:---:|
| **01** | Test I: Multiple Choice | Linked List Definition | **Slide 01**: Introduction & Foundation | ✅ Yes |
| **02** | Test I: Multiple Choice | Head Pointer Reference | **Slide 02**: Basic Components / Anatomy | ✅ Yes |
| **03** | Test I: Multiple Choice | Doubly Linked List Traversal | **Slide 04**: Types of Linked Lists | ✅ Yes |
| **04** | Test I: Multiple Choice | Traversal Definition | **Slide 03**: How it Works & **Slide 05**: Operations | ✅ Yes |
| **05** | Test I: Multiple Choice | Singly Linked List Tail Pointer | **Slide 02**: Basic Components & **Slide 03**: Memory Model | ✅ Yes |
| **06** | Test II: Identification | Node Payload / Stored Information | **Slide 02**: Basic Components (Data Field) | ✅ Yes |
| **07** | Test II: Identification | Removing Node & Relinking | **Slide 05**: Core Operations (Deletion) | ✅ Yes |
| **08** | Test II: Identification | Finding Target Value | **Slide 05**: Core Operations (Linear Search) | ✅ Yes |
| **09** | Test II: Identification | Flipping Pointers Direction | **Slide 05**: Core Operations (Reversing) | ✅ Yes |
| **10** | Test II: Identification | Operation Work vs Node Count | **Slide 09**: Time Complexity (Big-O Matrix) | ✅ Yes |
| **11** | Test III: True or False | Memory Allocation (Contiguous vs Dynamic) | **Slide 01**, **Slide 03**, **Slide 06**: Memory Benchmark | ✅ Yes |
| **12** | Test III: True or False | Doubly Linked List Pointers | **Slide 04**: Types of Linked Lists | ✅ Yes |
| **13** | Test III: True or False | Circular Singly Linked List Tail-to-Head | **Slide 04**: Types of Linked Lists | ✅ Yes |
| **14** | Test III: True or False | Direct Index Access Comparison (Array vs List) | **Slide 06**: Linked List vs Array Benchmark | ✅ Yes |
| **15** | Test III: True or False | Implementing Stacks & Queues | **Slide 07**: Pros & Cons, **Slide 08**: Applications | ✅ Yes |

---

## Detailed Answer Key

### TEST I: Multiple Choice (Questions 1 – 5)

#### 1. What is a linked list?
* **Correct Answer:** **A. A linear data structure made of connected nodes**
* **Presentation Reference:** **Slide 01 (Introduction / Foundation)**
  > *"A linked list is a linear data structure consisting of discrete nodes in heap memory, where each node contains data and an explicit pointer to the next node."*
* **Why others are incorrect:**
  * *B* is incorrect because linked lists are stored dynamically in non-contiguous heap memory, not consecutive memory.
  * *C* is incorrect because a linked list can store any number of values dynamically.
  * *D* is incorrect because dynamic insertion and deletion is one of the core features of linked lists.

#### 2. Which component points to the first node of a linked list?
* **Correct Answer:** **B. Head**
* **Presentation Reference:** **Slide 02 (Basic Components / Architecture)**
  > *"Head – The first node of the list and its starting point."*
* **Why others are incorrect:**
  * *Tail* refers to the last node.
  * *NULL* represents the absence of a node (the end of the list).
  * *Data* is the payload inside the node.

#### 3. Which type of linked list allows traversal in both forward and backward directions?
* **Correct Answer:** **C. Doubly linked list**
* **Presentation Reference:** **Slide 04 (Types of Linked Lists / Taxonomy)**
  > *"Doubly linked list – Each node points to both the next and the previous node (two directions)."*
* **Why others are incorrect:**
  * *Singly linked list* only points forward (`next`).
  * *Circular singly linked list* only points forward, looping back to the head.
  * *Linear array* is an index-based contiguous structure, not a linked pointer structure.

#### 4. What is traversal in a linked list?
* **Correct Answer:** **D. Visiting nodes one by one**
* **Presentation Reference:** **Slide 03 (How It Works) & Slide 05 (Basic Operations)**
  > *"Traversal – Visiting each node from the head to the tail one by one until null is reached."*
* **Why others are incorrect:**
  * *A* describes Deletion.
  * *B* describes Updating.
  * *C* describes Reversing.

#### 5. In a typical singly linked list, what does the last node point to?
* **Correct Answer:** **B. NULL**
* **Presentation Reference:** **Slide 02 (Basic Components) & Slide 03 (Memory Model)**
  > *"Tail – The last node of the list. Its pointer is null. Null marks the end of the list."*
* **Why others are incorrect:**
  * In circular lists it points to the head, but in a **typical singly linked list**, the terminal pointer is `NULL`.

---

### TEST II: Identification (Questions 6 – 10)

#### 6. The actual value or information stored inside a node.
* **Canonical Answer:** **Data**
* **Accepted Alternate Answers for Manual Checking:**
  * `Data` / `data`
  * `Value` / `value`
  * `Payload` / `payload`
* **Presentation Reference:** **Slide 02 (Basic Components / Architecture)**
  > *"Data – The actual value or information stored inside a node."*

#### 7. The operation that removes a node from a linked list and adjusts the links between the remaining nodes.
* **Canonical Answer:** **Deletion**
* **Accepted Alternate Answers for Manual Checking:**
  * `Deletion` / `deletion`
  * `Delete` / `delete`
  * `Node Deletion` / `Remove` / `Removal`
* **Presentation Reference:** **Slide 05 (Basic Operations Lab)**
  > *"Deletion – Removing a node by relinking the pointers around it."*

#### 8. The operation that finds whether a specific value exists in a linked list.
* **Canonical Answer:** **Searching**
* **Accepted Alternate Answers for Manual Checking:**
  * `Searching` / `searching`
  * `Search` / `search`
  * `Linear Search` / `linear search`
  * `Find` / `find`
* **Presentation Reference:** **Slide 05 (Basic Operations Lab)**
  > *"Searching – Checking each node one by one (linear search) to find a specific value."*

#### 9. The operation that changes the direction of the links so that the last node becomes the first node.
* **Canonical Answer:** **Reversing**
* **Accepted Alternate Answers for Manual Checking:**
  * `Reversing` / `reversing`
  * `Reverse` / `reverse`
  * `List Reversal` / `Reversal`
* **Presentation Reference:** **Slide 05 (Basic Operations Lab)**
  > *"Reversing – Flipping the direction of the pointers so the last node becomes the head."*

#### 10. The term that describes how the amount of work required by an operation grows as the number of nodes increases.
* **Canonical Answer:** **Time Complexity**
* **Accepted Alternate Answers for Manual Checking:**
  * `Time Complexity` / `time complexity`
  * `Big-O` / `Big-O Notation` / `Big O`
  * `Algorithmic Complexity` / `Asymptotic Complexity`
* **Presentation Reference:** **Slide 09 (Time Complexity / Big-O Matrix)**
  > *"Time Complexity – Measures execution time and operational growth as input size n grows asymptotically."*

---

### TEST III: True or False (Questions 11 – 15)

#### 11. The nodes of a linked list must be stored in consecutive memory locations.
* **Correct Answer:** **FALSE** (Option B)
* **Explanation:** Unlike arrays which require contiguous memory blocks, linked list nodes are dynamically allocated at scattered, non-contiguous addresses on the heap.
* **Presentation Reference:** **Slide 01, Slide 03, Slide 06 (Linked List vs Array)**
  > *"Memory allocation – Array: contiguous and fixed memory. Linked list: dynamic and non-contiguous memory."*

#### 12. A doubly linked list has links to both the previous node and the next node.
* **Correct Answer:** **TRUE** (Option A)
* **Explanation:** Each node contains two pointers: `next` and `prev`, allowing bidirectional traversal.
* **Presentation Reference:** **Slide 04 (Types of Linked Lists)**
  > *"Doubly linked list – Each node points to both the next and the previous node (two directions)."*

#### 13. In a circular singly linked list, the last node points back to the first node.
* **Correct Answer:** **TRUE** (Option A)
* **Explanation:** Instead of ending with `NULL`, the tail node points back to the head node, forming a continuous ring.
* **Presentation Reference:** **Slide 04 (Types of Linked Lists)**
  > *"Circular singly linked list – A singly linked list in which the last node points back to the head."*

#### 14. Linked lists provide faster direct index access than arrays.
* **Correct Answer:** **FALSE** (Option B)
* **Explanation:** Arrays provide instant $O(1)$ random access (`arr[i]`) using memory offsets. Linked lists do not support random indexing and require $O(n)$ sequential traversal.
* **Presentation Reference:** **Slide 06 (Linked List vs Array Benchmark)**
  > *"Accessing elements – Array: direct access by index, O(1). Linked list: sequential access, O(n)."*

#### 15. Linked lists can be used to implement stacks and queues.
* **Correct Answer:** **TRUE** (Option A)
* **Explanation:** Stacks (LIFO) and Queues (FIFO) are naturally implemented with linked lists using $O(1)$ head/tail insertions and deletions.
* **Presentation Reference:** **Slide 07 (Pros & Cons) & Slide 08 (Real-World Applications)**
  > *"Serves as a base for other structures such as stacks and queues."*

---

## Teacher / Grader Quick Reference Sheet

| # | Type | Question Snippet | Quick Answer Key |
|---|---|---|---|
| **1** | MC | What is a linked list? | **A** (Linear structure of connected nodes) |
| **2** | MC | Points to the first node? | **B** (Head) |
| **3** | MC | Forward & backward traversal? | **C** (Doubly linked list) |
| **4** | MC | What is traversal? | **D** (Visiting nodes one by one) |
| **5** | MC | Last node points to? | **B** (NULL) |
| **6** | ID | Information stored in node? | **Data** (or Value / Payload) |
| **7** | ID | Removes node and adjusts links? | **Deletion** (or Delete / Remove) |
| **8** | ID | Finds whether value exists? | **Searching** (or Search / Find) |
| **9** | ID | Changes direction of links? | **Reversing** (or Reverse) |
| **10** | ID | Growth of work as nodes increase? | **Time Complexity** (or Big-O) |
| **11** | T/F | Must be consecutive memory? | **FALSE** |
| **12** | T/F | Doubly list links to prev & next? | **TRUE** |
| **13** | T/F | Circular last points to first? | **TRUE** |
| **14** | T/F | Faster direct index access than arrays? | **FALSE** |
| **15** | T/F | Can implement stacks & queues? | **TRUE** |
