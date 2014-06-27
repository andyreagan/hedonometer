from cmplxsys.models import Person,Paper,Funding,Press,Project
from tastypie.resources import ModelResource, ALL, ALL_WITH_RELATIONS
from tastypie import fields

class BasicPersonResource(ModelResource):
    class Meta:
        queryset = Person.objects.all()
        resource_name = 'person'
        filtering = {
            'uname': ALL,
        }

class PersonResource(ModelResource):
    # the person resource always gets their papers
    papers = fields.ManyToManyField('cmplxsys.api.BasicPaperResource','paper_set',full=True)
    # could also get their funding, and press, but not now

    class Meta:
        queryset = Person.objects.all()
        resource_name = 'person'
        filtering = {
            'uname': ALL,
        }

class BasicPaperResource(ModelResource):
    class Meta:
        queryset = Paper.objects.all()
        resource_name = 'paper'
        filtering = {
            'title': ALL,
            'author': ALL,
        }

class PaperResource(ModelResource):
    # the paper resource always gets the authors
    author = fields.ManyToManyField('cmplxsys.api.BasicPersonResource','authors',full=True)
    # and the press
    press = fields.ManyToManyField('cmplxsys.api.BasicPressResource','press_set',full=True)

    class Meta:
        queryset = Paper.objects.all()
        resource_name = 'paper'
        filtering = {
            'title': ALL,
            'author': ALL,
        }

class BasicFundingResource(ModelResource):
    class Meta:
        queryset = Funding.objects.all()
        resource_name = 'funding'
        filtering = {
            'source': ALL,
        }

class BasicProjectResource(ModelResource):
    class Meta:
        queryset = Project.objects.all()
        resource_name = 'project'
        filtering = {
            'title': ALL,
        }

class BasicPressResource(ModelResource):
    class Meta:
        queryset = Press.objects.all()
        resource_name = 'press'
        filtering = {
            'date': ALL,
        }




