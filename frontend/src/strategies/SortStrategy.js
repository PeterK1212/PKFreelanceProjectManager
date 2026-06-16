// Strategy pattern: base class defining the common interface every project
// sort strategy shares. Concrete subclasses override sort() with their own
// algorithm, so the UI can swap sorting behaviour at runtime. Demonstrates
// inheritance (subclasses extend this base) and polymorphism (same sort()
// method, different behaviour).
class SortStrategy {

    // Returns a NEW sorted array; implementations must never mutate the input.
    sort(projects) {
        throw new Error('sort() must be implemented by a subclass');
    }
}

export default SortStrategy;
