import os
os.makedirs("/Users/jzz/code/java/joj/frontend/src/views/course/lesson", exist_ok=True)
# 1. CourseDetailView.vue
with open("/Users/jzz/code/java/joj/frontend/src/views/course/CourseDetailView.vue", "w") as f:
    f.write("""<template>
  <div class="course-detail-wrapper">
    <div v-if="loading" class="loading-state">加载中...</div>
    <div v-else-if="course" class="course-container">
      <div class="course-header">
        <div class="cover-wrapper">
          <img v-if="course.coverUrl" :src="course.coverUrl" :alt="course.title" />
          <div v-else class="cover-placeholder">无封面</div>
        </div>
        <div class="course-info">
          <h1 class="course-title">{{ course.title }}</h1>
          <p class="course-desc">{{ course.description }}</p>
        </div>
      </div>
      <div class="course-lessons">
        <h2 class="section-title">课程章节</h2>
        <div v-if="loadingLessons" class="loading-state">加载章节模块中import os
os.makedirs("/Users/jzz/codeonos.maked =# 1. CourseDetailView.vue
with open("/Users/jzz/code/java/joj/frontend/src/views/courselwith open("/Users/jzz/cr="    f.write("""<template>
  <div class="course-detail-wrapper">
    <div v-if="loading" class=on  <div class="course-detpa    <div v-if="loading" class="loadiex    <div v-else-if="course" class="course-container">
      <dion      <div class="course-header">
        <div clasv c        <div class="cover-wrappe            <img v-if="course.coverU@c          <div v-else class="cover-placeholder">无封面</div>
        </div>
   ="        </div>
        <div class="course-info">
          <h1??        <div             <h1 class="course-titl>
          <p class="course-desc">{{ course.description }}e>        </div>
      </div>
      <div class="course-lessons }      </div>
im      <div ou        <h2 class="section-title";
        <div v-if="loadingLessons" class="loading-roos.makedirs("/Users/jzz/codeonos.maked =# 1. CourseDetailView.vue
with open("/Users/jzltwith open("/Users/jzz/code/java/joj/frontend/src/views/courselwion  <div class="course-detail-wrapper">
    <div v-if="loading" class=on  <div class="course-detpa    <div v-if="loa    <div v-if="loading" class=on  <des      <dion      <div class="course-header">
        <div clasv c        <div class="cover-wrappe            <img v-if="course.coverU@c          <di=>        <div clasv c        <div class="cov          </div>
   ="        </div>
        <div class="course-info">
          <h1??        <div             <h1 class="course-titl>
          <p class=;
   ="                  <div class            <h1??        <div     ?         <p class="course-desc">{{ course.description }}e>   al      </div>
      <div class="course-lessons }      </div>
im      <divng      <div ueim      <div ou        <h2 class="section-titt         <div v-if="loadingLessons" class="loadint(with open("/Users/jzltwith open("/Users/jzz/code/java/joj/frontend/src/views/courselwion  <div class="course-detail- =    <div v-if="loading" class=on  <div class="course-detpa    <div v-if="loa    <div v-if="loading" class=on  <des      <dio??        <div clasv c        <div class="cover-wrappe            <img v-if="course.coverU@c          <di=>        <div clasv c        <div class="cov         t:   ="        </div>
        <div class="course-info">
          <h1??        <div             <h1 class="course-titl>
          <p class=;
   ="                  <          <div class;
          <h1??        <div     
           <p class=;
   ="                  <div class        lo   ="               g      <div class="course-lessons }      </div>
im      <divng      <div ueim      <div ou        <h2 class="section-titt         <div v-if="loadinim      <divng      <div ueim      <div ou   ta        <div class="course-info">
          <h1??        <div             <h1 class="course-titl>
          <p class=;
   ="                  <          <div class;
          <h1??        <div     
           <p class=;
   ="                  <div class        lo   ="               g      <div class="course-lessons }      </div>
im      <divng      <div ueim      <div ou        <h2 class="section-titt         <div v-if="loadinim      <divng      <div ueim      <div ou   ta        <div class="course-info">
          <h1??        <div       im          <h1??        <div     %;          <p class=;
   ="                  <          <div clhe   ="              ro          <h1??        <div     
           ex           <p class=;
   ="    if   ="                cim      <divng      <div ueim      <div ou        <h2 class="section-titt         <div v-if="loadinim      <dm;          <h1??        <div             <h1 class="course-titl>
          <p class=;
   ="                  <          <div class;
          <h1??        <div     
           <p px          <p class=;
   ="                  <          <div cles   ="              y:          <h1??        <div     
           ;
           <p class=;
   ="    x;   ="               spim      <divng      <div ueim      <div ou        <h2 class="section-titt         <div v-if="loadinim      <ds:          <h1??        <div       im          <h1??        <div     %;          <p class=;
   ="                  <          <div clhe   ="              ro          <h1??        es   ="                  <          <div clhe   ="              ro          <h1??        <d:            ex           <p class=;
   ="    if   ="                cim      <divng      <div uen-   ="    if   ="                c 1          <p class=;
   ="                  <          <div class;
          <h1??        <div     
           <p px          <p class=;
   ="                  <          <div cles   ="              y:     24   ="              60          <h1??        <div     
            0           <p px          <p clck   ="                  <          <bo           ;
           <p class=;
   ="    x;   ="               spim      <divng      <div ue c           99   ="    x;   ="    d    ="                  <          <div clhe   ="              ro          <h1??        es   ="                  <          <div clhe   ="              ro          <h1??        <d:            ex           <p class=;
   ="    if   ="  wi   ="    if   ="                cim      <divng      <div uen-   ="    if   ="                c 1          <p class=;
   ="                  <          <div class;
          <h1??        <div     
           <p px<d   ="                  <          <div class;
          <h1??        <div     
           <p px          <p class=;
??          <h1??        <div     
                        <p px          <p clco   ="                  <          < c            0           <p px          <p clck   ="                  <          <bo           ;
           <p class=;
   ="}/           <p class=;
   ="    x;   ="               spim      <divng      <div ue c          -d   ="    x;   ="         ="    if   ="  wi   ="    if   ="                cim      <divng      <div uen-   ="    if   ="                c 1          <p class=;
   ="                  <          <div class;
          <h1??        <div     
           <p px<d   ="                  <          <div class;
          <h1??        <div   @   ="                  <          <div class;
          <h1??        <div     
           <p px<d   ="                  <          <div /d          <h1??        <div     
           im           <p px<d   ="        d           <h1??        <div     
           <p px          <p ;
           <p px          <p cl{
??          <h1??        <div     
tu                        <p px    );           <p class=;
   ="}/           <p class=;
   ="    x;   ="               spim      <divng      <div ue c          -d   ="    x;   ="         ="    if   ="  wi   ="    i {   ="}/           <p/c   ="    x;   ="                ="                  <          <div class;
          <h1??        <div     
           <p px<d   ="                  <          <div class;
          <h1??        <div   @   ="                  <          <div class;
          <h.w          <h1??        <div     
           nt           <p px<d   ="        ms          <h1??        <div   @   ="                  <       r:          <h1??        <div     
           <p px<d   ="                  <s            <p px<d   ="        s:           im           <p px<d   ="        d           <h1??        <div     
           0            <p px          <p ;
           <p px          <p cl{
??          < 0           <p px          <p tr??          <h1??        <div  titu                        <p px  }
   ="}/           <p class=;
   ="    x;   ="            gr   ="    x;   ="           25          <h1??        <div     
           <p px<d   ="                  <          <div class;
          <h1??        <div   @   ="                  <          <div class;
          <h.w          <h1??        <div     
  ol           <p px<d   ="        we          <h1??        <div   @   ="                  <       -c          <h.w          <h1??        <div     
           nt           <p p:            nt           <p px<d   ="        mso           <p px<d   ="                  <s            <p px<d   ="        s:           im           <p px<d   ="        d           <h1??   bt           0            <p px          <p ;
           <p px          <p cl{
??          < 0           <p px          <p tr??          <h1??        <div  or           <p px          <p cl{
??       jo??          < 0           <p pxso   ="}/           <p class=;
   ="    x;   ="            gr   ="    x;   ="           25          <h1??        <"    ="    x;   ="           ??          <p px<d   ="                  <          <div class;
          <h1??        <diss          <h1??        <div   @   ="                  <        F          <h.w          <h1??        <div     
  ol           <p px<d   =" <d  ol           <p px<d   ="        we        ">           nt           <p p:            nt           <p px<d   ="        mso           <p px<d   ="                  <s            <p px<d   ="               <p px          <p cl{
??          < 0           <p px          <p tr??          <h1??        <div  or           <p px          <p cl{
??       jo??          < 0           <p pxso   ="}/           <p class=;
   ="    x;   ="            gr   ="    x;   ri??          < 0           <p px>
??       jo??          < 0           <p pxso   ="}/           <p class=;
   ="    x;   ="            gr   ="  m    ="    x;   ="            gr   ="    x;   ="           25          <hro          <h1??        <diss          <h1??        <div   @   ="                  <        F          <h.w          <h1??        <div     
  ol           <p px<d   =" <d  ol   ns  ol           <p px<d   =" <d  ol           <p px<d   ="        we        ">           nt           <p p:            nt           <p px< l??          < 0           <p px          <p tr??          <h1??        <div  or           <p px          <p cl{
??       jo??          < 0           <p pxso   ="}/           <p class=;
   ="    x;   ="            gr   ="    x;   ri??          < 0          ) ??       jo??          < 0           <p pxso   ="}/           <p class=;
   ="    x;   ="            gr   ="       ="    x;   ="            gr   ="    x;   ri??          < 0            ??       jo??          < 0           <p pxso   ="}/           <p class=;
   =     ="    x;   ="            gr   ="  m    ="    x;   ="            gr  co  ol           <p px<d   =" <d  ol   ns  ol           <p px<d   =" <d  ol           <p px<d   ="        we        ">           nt           <p p:            nt           <p px< l??          < 0           <p px          <p tr??          <h1??        co??       jo??          < 0           <p pxso   ="}/           <p class=;
   ="    x;   ="            gr   ="    x;   ri??          < 0          ) ??       jo??          < 0           <p pxso   ="}/           <p class=;
   ="    x;   ="            gr   ="       ="    x;   ="            gr     ="    x;   ="            gr   ="    x;   ri??          < 0           #   ="    x;   ="            gr   ="       ="    x;   ="            gr   ="    x;   ri??          < 0            ??       jo??          < 0       {   =     ="    x;   ="            gr   ="  m    ="    x;   ="            gr  co  ol           <p px<d   =" <d  ol   ns  ol           <p px<d   =" <d  ol           <p px<d   ="        .0   ="    x;   ="            gr   ="    x;   ri??          < 0          ) ??       jo??          < 0           <p pxso   ="}/           <p class=;
   ="    x;   ="            gr   ="       ="    x;   ="            gr     ="    x;   ="            gr   ="    x;   ri??          < 0           #   ="    x;   ="            gr   ="       ="    x;   ="            gr   ="    x;   ri??          < 0           ">   ="    x;   ="            gr   ="       ="    x;   ="            gr     ="    x;   ="            gr   ="    x;   ri??          < 0           #??  ="    x;   ="            gr   ="       ="    x;   ="            gr     ="    x;   ="            gr   ="    x;   ri??          < 0           #   ="    x;   ="            gr   ="       ="    x;   ="            gr   ="    x;   ri??          < 0           ">   ="    x;   ="            gr   ="       ="    x;   ="            gr     ="    x;   ="            gr   ="    x;   ri??          < 0           #??  ="    x;   ="            gr   ="       ="    x;   ="            gr     ="    x;   ="            gr   ="    x;   ri??          < 0           #   ="    x;   ="            gr   ="       ="    x;   ="            gr   px;
}
h2 {
  color: #f8fafc;
  font-size: 1.5rem;
  margin-bottom: 12px;
}
p {
  color: #94a3b8;
  line-height: 1.5;
}
</style>
""")
print("Views generated")
