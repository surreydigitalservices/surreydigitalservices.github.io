---
layout: post
title:  "MasterMap Topographic Layer in QGIS"
date:   2016-01-27 11:54:38
category: Ordnance Survey
tags: Ordnance Survey, QGIS
author: David McDermott
---

In July 2015, Ordnance Survey published new styling options for its MasterMap Topographic Layer. These new styles complemented the backdrop styles for the VectorMap products, Meridian2 and Strategi very well. The stylesheets can be downloaded here:

* [MasterMap Topograhpic Layer][OsmmTopo]
* [VectorMap Local][vml]
* [VectorMap District][vmd]
* [Meridian2]
* [Strategi]

At SDS we were very impressed with the new stylesheets provided by OS and wanted to get them rendered in QGIS. As you can see below, the results are pretty nice.

<a href="https://s3-eu-west-1.amazonaws.com/shbcdatastore/MasterMapTopoStyleExample.png">
<img src="https://s3-eu-west-1.amazonaws.com/shbcdatastore/MasterMapTopoStyleExample.png" class="img-responsive">
</a>

[//]: # (![](https://s3-eu-west-1.amazonaws.com/shbcdatastore/MasterMapTopoStyleExample.png))

The powerful and versatile [FME] Desktop (Feature Manipulation Engine) from [Safe Software] provided the perfect platform for completing this task. Using a template provided by [SterlingGeo] I went to work updating the workspace to take advantage of the new style codes.  This included adding new documentation, publishing parameters, and updating the AttributeCreator Transformers.

By publishing certain parameters such as database connection detail,  this workspace becomes more accessible to less experienced FME users. Simply run the workspace with prompts and fill in the details. The style codes are added to the data using AttributeCreator transformers with conditional values (like CASE WHEN statements). This bypases the rather convoluted SQL scripts provided by OS. You are welcome to download, explore and try this FME workspace [here][FME-Workspace]. 

----------------------- ------------------------------------
![notice](https://s3-eu-west-1.amazonaws.com/shbcdatastore/Imbox_notice.png) **Notice**

FME workspaces run on a simple principle of readers, writers and transformers. This workspace is specifically designed to read .gz files and write to PostGIS. If you need/want to read or write to other formats you will need to edit the workspace accordingly. 

----------------------------------------------------------------

Unfortunately, these new stylesheets can be a little finicky. They come with font and png files to render some of the features. The font needs to be installed and the pngs need to be stored somewhere your QGIS installation can see them. You will then have to update the stylesheets to point to the absolute path of these images.

Now, FME isn't perfect either. It's a proprietary system and the scale of the functionality is quite daunting, but it is unbelievably customizable and can be adapted to any situation. If you are looking for a Free and Open Source option however, then I would recommend Lutra Consulting's [OS-Translator2] or Astun Technology's [Loader]. 

> Written with [StackEdit](https://stackedit.io/).

[OS-Translator2]: http://www.lutraconsulting.co.uk/products/ostranslator-ii/
[Loader]: https://github.com/AstunTechnology/Loader

[OsmmTopo]: https://github.com/OrdnanceSurvey/OSMM-Topography-Layer-stylesheets
[vml]: https://github.com/OrdnanceSurvey/OS-VectorMap-Local-stylesheets
[vmd]: https://github.com/OrdnanceSurvey/OS-VectorMap-District-stylesheets
[Meridian2]: https://github.com/OrdnanceSurvey/Meridian2-stylesheets
[Strategi]: https://github.com/OrdnanceSurvey/Strategi-stylesheets

[SterlingGeo]: http://www.sterlinggeo.com/fme-desktop.html
[Safe Software]: http://www.safe.com/
[FME]: http://www.safe.com/fme/fme-desktop/index_a.php?utm_expid=104599522-5.6ohgqbwfQxqX1uiFeVryMw.1&utm_referrer=http%3A%2F%2Fwww.safe.com%2Fhow-it-works%2F
[notice]: https://s3-eu-west-1.amazonaws.com/shbcdatastore/Imbox_notice.png
[FME-Workspace]: https://github.com/surreydigitalservices/fme-workspaces/blob/master/osmm_loader_share.fmw
