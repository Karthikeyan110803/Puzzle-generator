const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ]
  },

  {
    path: '/puzzles',
    
    children: [
      { path: '', component: () => import('pages/Puzzle.vue') }
    ]
  },
  {
    path: '/cross',
    
    children: [
      { path: '', component: () => import('pages/Crosspuzzle.vue') }
    ]
  },
  {
    path: '/puzz',
    
    children: [
      { path: '', component: () => import('pages/Puzz.vue') }
    ]
  },
  {
    path: '/new',
    
    children: [
      { path: '', component: () => import('pages/New.vue') }
    ]
  },
  {
    path: '/quiz',
    
    children: [
      { path: '', component: () => import('pages/Quiz.vue') }
    ]
  },
  {
    path: '/word',
    
    children: [
      { path: '', component: () => import('pages/Word.vue') }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
