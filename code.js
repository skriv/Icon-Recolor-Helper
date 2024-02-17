"use strict";
function main() {
    // Get the current selection from the Figma document
    const selection = figma.currentPage.selection;
    // Check if any elements are selected
    if (selection.length === 0) {
        figma.closePlugin("Please select one or more elements.");
        return;
    }
    // Iterate over each selected node
    selection.forEach(node => {
        // Check if the node is a container that can have children (e.g., frame, group, component)
        if ("children" in node) {
            // Filter out vector nodes (VECTOR type) from the children of the node
            const vectorNodes = node.children.filter(child => child.type === "VECTOR" || child.type === "GROUP");
            // const vectorNodesAndGroups = node.children.filter(child => child.type === "VECTOR" || child.type === "GROUP");
            if (vectorNodes.length === 1) {
                // If there is only one vector node, create a duplicate and union it with the original
                const clone = vectorNodes[0].clone(); // Create a clone of the vector node
                node.appendChild(clone); // Add the clone to the parent node
                const union = figma.union([vectorNodes[0], clone], node); // Create a union of the original node and its clone
                clone.remove(); // Remove the clone after creating the union
            }
            else if (vectorNodes.length > 1) {
                // If there are more than one vector nodes, union all of them
                const union = figma.union(vectorNodes, node); // Create a union of all vector nodes
            }
        }
    });
    // Close the plugin after processing is complete
    figma.closePlugin("Processing completed.");
}
// Execute the main function
main();
