export const initialWorkflows = [{
  id: '1',
  name: 'Design Review Workflow',
  states: [
    { id: 'draft', name: 'Draft', type: 'initial', color: '#6B7280', order: 0 },
    { id: 'in_progress', name: 'In Progress', type: 'intermediate', color: '#3B82F6', order: 1 },
    { id: 'review', name: 'Review', type: 'intermediate', color: '#F59E0B', order: 2 },
    { id: 'approved', name: 'Approved', type: 'terminal', color: '#10B981', order: 3 },
    { id: 'rejected', name: 'Rejected', type: 'terminal', color: '#EF4444', order: 3 },
  ],
  actions: [
    {
      id: 'a1', name: 'Start Work', fromState: 'draft', toState: 'in_progress',
      buttonColor: '#3B82F6', components: [], hasTasks: true,
      tasks: [
        {
          id: 't1',
          name: 'Setup Project',
          description: 'Create folder structure',
          type: 'development',
          components: [{ id: 'tc1', type: 'checklist', label: 'Setup Steps', required: true, items: ['Create folders', 'Import assets'] }],
          onComplete: 'continue',
          onCompleteTarget: null,
          worklogs: []
        },
        {
          id: 't2',
          name: 'Review Brief',
          description: 'Read requirements',
          type: 'review',
          components: [{ id: 'tc2', type: 'textarea', label: 'Notes', required: false }],
          onComplete: 'continue',
          onCompleteTarget: null,
          worklogs: []
        }
      ]
    },
    { id: 'a2', name: 'Submit for Review', fromState: 'in_progress', toState: 'review', buttonColor: '#F59E0B', components: [{ id: 'c1', type: 'file', label: 'Design Files', required: true }], hasTasks: false, tasks: [] },
    { id: 'a3', name: 'Approve', fromState: 'review', toState: 'approved', buttonColor: '#10B981', components: [{ id: 'c2', type: 'checklist', label: 'Checklist', required: true, items: ['Logo OK', 'Colors OK'] }], hasTasks: false, tasks: [] },
    { id: 'a4', name: 'Reject', fromState: 'review', toState: 'rejected', buttonColor: '#EF4444', components: [{ id: 'c3', type: 'textarea', label: 'Reason', required: true }], hasTasks: false, tasks: [] },
    {
      id: 'a5', name: 'Request Changes', fromState: 'review', toState: 'in_progress',
      buttonColor: '#8B5CF6', components: [{ id: 'c5', type: 'textarea', label: 'Changes', required: true }],
      hasTasks: true,
      tasks: [{
        id: 't3',
        name: 'Review Feedback',
        description: 'Check all feedback',
        type: 'review',
        components: [{ id: 'tc3', type: 'checklist', label: 'Items', required: true, items: ['Read comments', 'Identify changes'] }],
        onComplete: 'continue',
        onCompleteTarget: null,
        worklogs: []
      }]
    },
    { id: 'a6', name: 'Quick Approve', fromState: 'draft', toState: 'approved', buttonColor: '#10B981', components: [], hasTasks: false, tasks: [] },
  ],
  assetTypes: ['Campaign Image', 'Product Photo']
}];

export const initialAssetTypes = [
  {
    id: '1',
    name: 'Campaign Image',
    icon: 'image',
    customFields: [
      { id: 'f1', name: 'Campaign Name', type: 'text', required: true },
      { id: 'f2', name: 'Target Market', type: 'select', required: true },
      { id: 'f3', name: 'Season', type: 'text', required: false },
      { id: 'f4', name: 'Description', type: 'textarea', required: false },
      { id: 'f5', name: 'Launch Date', type: 'date', required: true },
      { id: 'f6', name: 'Dimensions', type: 'text', required: true },
      { id: 'f7', name: 'Color Mode', type: 'select', required: true },
      { id: 'f8', name: 'For Print', type: 'checkbox', required: false }
    ]
  },
  {
    id: '2',
    name: 'Product Photo',
    icon: 'image',
    customFields: [
      { id: 'f9', name: 'SKU', type: 'text', required: true },
      { id: 'f10', name: 'Product Name', type: 'text', required: true },
      { id: 'f11', name: 'Category', type: 'select', required: true },
      { id: 'f12', name: 'Price', type: 'number', required: true },
      { id: 'f13', name: 'In Stock', type: 'checkbox', required: false },
      { id: 'f14', name: 'Description', type: 'textarea', required: false },
      { id: 'f15', name: 'Photographer', type: 'text', required: false },
      { id: 'f16', name: 'Photo Date', type: 'date', required: true },
      { id: 'f17', name: 'Background Color', type: 'text', required: false },
      { id: 'f18', name: 'Angle', type: 'select', required: false },
      { id: 'f19', name: 'Lighting Setup', type: 'textarea', required: false },
      { id: 'f20', name: 'Retouched', type: 'checkbox', required: false }
    ]
  },
  {
    id: '3',
    name: 'Brand Video',
    icon: 'video',
    customFields: [
      { id: 'f21', name: 'Video Title', type: 'text', required: true },
      { id: 'f22', name: 'Duration', type: 'text', required: true },
      { id: 'f23', name: 'Resolution', type: 'select', required: true },
      { id: 'f24', name: 'Format', type: 'select', required: true },
      { id: 'f25', name: 'Description', type: 'textarea', required: false },
      { id: 'f26', name: 'Has Audio', type: 'checkbox', required: false }
    ]
  },
];
